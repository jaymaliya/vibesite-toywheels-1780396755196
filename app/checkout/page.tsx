"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], clearCart, totalPrice = 0 } = useCart() ?? {};

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [payData, setPayData] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paymentLaunched, setPaymentLaunched] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("will-reveal");
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = "Valid email is required";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (!address.trim()) errs.address = "Address is required";
    if (!city.trim()) errs.city = "City is required";
    if (!state.trim()) errs.state = "State is required";
    if (!pin.trim() || !/^\d{6}$/.test(pin)) errs.pin = "Enter a valid 6-digit PIN code";
    return errs;
  }

  async function handleProceed() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price }))),
        }),
      });
      const data = await res.json();
      setPayData(data);
    } catch {
      setPaying(false);
    }
  }

  async function payNow() {
    if (!payData) return;
    if (typeof (window as any).PaymentRequest !== "undefined") {
      try {
        const req = new (window as any).PaymentRequest(
          [
            {
              supportedMethods: "https://tez.google.com/pay",
              data: {
                pa: payData.upiId,
                tr: payData.orderId,
                am: String(payData.amount),
                cu: "INR",
              },
            },
          ],
          {
            total: {
              label: "Total",
              amount: { currency: "INR", value: String(payData.amount) },
            },
          }
        );
        const canPay = await req.canMakePayment();
        if (canPay) {
          const response = await req.show();
          await response.complete("success");
          setPaymentLaunched(true);
          return;
        }
      } catch (_e) {}
    }
    window.location.href = `upi://pay?pa=${encodeURIComponent(payData.upiId)}&am=${payData.amount}&cu=INR`;
    setTimeout(() => setPaymentLaunched(true), 4000);
  }

  async function confirmOrder() {
    if (!payData) return;
    setConfirming(true);
    try {
      await fetchh("/api/upi-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payData.orderId,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price }))),
          brandName: "toywheels",
          amount: payData.amount,
          upiTxnId,
        }),
      });
      setPaid(true);
      clearCart && clearCart();
    } catch {
      setPaid(true);
      clearCart && clearCart();
    }
    setConfirming(false);
  }

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent);

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    height: "52px",
    padding: "0 16px",
    background: "var(--surface)",
    border: errors[field] ? "1.5px solid #E61F27" : "1.5px solid #333",
    borderRadius: "4px",
    color: "var(--text)",
    fontSize: "15px",
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color 0.2s ease",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontFamily: "var(--font-heading)",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: "6px",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "var(--primary)",
    marginTop: "4px",
    fontFamily: "var(--font-body)",
  };

  if (items.length === 0 && !paid) {
    return (
      <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
            gap: "24px",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "var(--text)",
              margin: 0,
            }}
          >
            Your Cart is Empty
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "16px", lineHeight: 1.6, maxWidth: "400px" }}>
            No models in your collection yet. Browse our die-cast lineup and find your next legend.
          </p>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{
              padding: "16px 40px",
              background: "var(--accent)",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            Start Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", minHeight: "100vh" }}>
      <Navbar />

      {/* Page Header */}
      <div
        className="reveal"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid #333",
          padding: "40px 24px 32px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              margin: "0 0 8px",
            }}
          >
            ToyWheels · Checkout
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: "var(--text)",
              margin: 0,
            }}
          >
            Complete Your Order
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="reveal"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "48px 24px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "40px",
          alignItems: "start",
        }}
      >
        {/* LEFT — Delivery Form */}
        <div>
          {/* Section Label */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "var(--accent)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "14px", color: "#000" }}>1</span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--text)",
                margin: 0,
              }}
            >
              Delivery Details
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Full Name */}
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                placeholder="Arjun Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle("name")}
                onFocus={(e) => { if (!errors.name) e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { if (!errors.name) e.currentTarget.style.borderColor = "#333"; }}
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="arjun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle("email")}
                onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { if (!errors.email) e.currentTarget.style.borderColor = "#333"; }}
              />
              {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                style={inputStyle("phone")}
                onFocus={(e) => { if (!errors.phone) e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { if (!errors.phone) e.currentTarget.style.borderColor = "#333"; }}
              />
              {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label style={labelStyle}>Street Address</label>
              <textarea
                placeholder="House No, Street, Locality"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                style={{
                  ...inputStyle("address"),
                  height: "auto",
                  padding: "14px 16px",
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
                onFocus={(e) => { if (!errors.address) e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { if (!errors.address) e.currentTarget.style.borderColor = "#333"; }}
              />
              {errors.address && <p style={errorStyle}>{errors.address}</p>}
            </div>

            {/* City + State */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "16px" }}>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={inputStyle("city")}
                  onFocus={(e) => { if (!errors.city) e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onBlur={(e) => { if (!errors.city) e.currentTarget.style.borderColor = "#333"; }}
                />
                {errors.city && <p style={errorStyle}>{errors.city}</p>}
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input
                  type="text"
                  placeholder="Maharashtra"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  style={inputStyle("state")}
                  onFocus={(e) => { if (!errors.state) e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onBlur={(e) => { if (!errors.state) e.currentTarget.style.borderColor = "#333"; }}
                />
                {errors.state && <p style={errorStyle}>{errors.state}</p>}
              </div>
            </div>

            {/* PIN */}
            <div>
              <label style={labelStyle}>PIN Code</label>
              <input
                type="text"
                placeholder="400001"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                style={{ ...inputStyle("pin"), maxWidth: "180px" }}
                onFocus={(e) => { if (!errors.pin) e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { if (!errors.pin) e.currentTarget.style.borderColor = "#333"; }}
              />
              {errors.pin && <p style={errorStyle}>{errors.pin}</p>}
            </div>
          </div>

          {/* Payment Method Tag */}
          <div
            style={{
              marginTop: "32px",
              padding: "16px 20px",
              background: "var(--surface)",
              borderRadius: "4px",
              border: "1.5px solid #333",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "var(--accent)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)", margin: 0 }}>
                UPI Payment
              </p>
              <p style={{ color: "var(--muted)", fontSize: "13px", margin: "2px 0 0", lineHeight: 1.5 }}>
                Google Pay · PhonePe · Paytm · Any UPI App
              </p>
            </div>
            <div style={{ marginLeft: "auto", width: "18px", height: "18px", borderRadius: "50%", background: "var(--accent)", border: "none", flexShrink: 0 }} />
          </div>

          {/* CTA */}
          <button
            onClick={handleProceed}
            disabled={paying}
            onMouseEnter={(e) => { if (!paying) e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => { if (!paying) e.currentTarget.style.transform = "scale(1.02)"; }}
            style={{
              marginTop: "28px",
              width: "100%",
              boxSizing: "border-box",
              height: "56px",
              background: paying ? "#555" : "var(--accent)",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "17px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: paying ? "not-allowed" : "pointer",
              transition: "transform 0.15s ease",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {paying ? "Processing…" : `Proceed to Pay — ₹${total.toLocaleString("en-IN")}`}
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
            {[
              { icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              ), text: "100% Secure" },
              { icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
              ), text: "Fast Dispatch" },
              { icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              ), text: "Pan-India Delivery" },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {t.icon}
                <span style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-body)" }}>{t.text}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button
              onClick={() => router.push("/shop")}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "var(--surface)",
                border: "1.5px solid #444",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "14px", color: "var(--muted)" }}>2</span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--text)",
                margin: 0,
              }}
            >
              Order Summary
            </h2>
          </div>

          <div
            style={{
              background: "var(--surface)",
              borderRadius: "4px",
              border: "1px solid #333",
              overflow: "hidden",
            }}
          >
            {/* Items */}
            <div style={{ padding: "20px 20px 0" }}>
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                    paddingBottom: "20px",
                    borderBottom: idx < items.length - 1 ? "1px solid #2e2e2e" : "none",
                    marginBottom: idx < items.length - 1 ? "20px" : 0,
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      flexShrink: 0,
                      background: "#fff",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                        fontSize: "14px",
                        letterSpacing: "0.01em",
                        color: "var(--text)",
                        margin: "0 0 4px",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      } as React.CSSProperties}
                    >
                      {item.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--muted)", margin: 0 }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 700,
                        fontSize: "15px",
                        color: "var(--accent)",
                        margin: 0,
                      }}
                    >
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--muted)", margin: "2px 0 0" }}>
                      ₹{item.price.toLocaleString("en-IN")} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "#333", margin: "0 0" }} />

            {/* Totals */}
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", color: "var(--muted)", fontFamily: "var(--font-body)" }}>Subtotal</span>
                <span style={{ fontSize: "14px", color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "14px", color: "var(--muted)", fontFamily: "var(--font-body)" }}>Shipping</span>
                <span
                  style={{
                    fontSize: "14px",
                    color: shipping === 0 ? "#4ade80" : "var(--text)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                >
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: "12px", color: "var(--muted)", margin: "-8px 0 14px", lineHeight: 1.5 }}>
                  Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for free shipping
                </p>
              )}
              <div style={{ height: "1px", background: "#333", marginBottom: "16px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "16px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text)",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    fontSize: "22px",
                    color: "var(--accent)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Trust strip */}
            <div
              style={{
                padding: "14px 20px",
                background: "var(--bg)",
                borderTop: "1px solid #2e2e2e",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-body)", margin: 0 }}>
                Secured by 256-bit SSL encryption · Trusted by 10,000+ collectors
              </p>
            </div>
          </div>

          {/* Specs reminder */}
          <div
            style={{
              marginTop: "20px",
              padding: "16px 20px",
              background: "var(--surface)",
              borderRadius: "4px",
              border: "1px solid #333",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent)",
                margin: "0 0 10px",
              }}
            >
              What You're Getting
            </p>
            {[
              "Official Licensed Die-Cast Models",
              "Precision Metal Construction",
              "Collector-Grade Packaging",
              "Pan-India Delivery in 3–7 days",
            ].map((spec, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: i < 3 ? "8px" : 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
                  {spec}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* ─── Payment Overlay ─── */}
      {payData && !paid && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.82)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: "12px",
              padding: "28px",
              width: "100%",
              maxWidth: "400px",
              boxSizing: "border-box",
              border: "1px solid #333",
              position: "relative",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src="/logo.png" alt="toywheels" style={{ height: "28px", objectFit: "contain" }} />
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--text)",
                  }}
                >
                  toywheels
                </span>
              </div>
              <button
                onClick={() => { setPayData(null); setPaying(false); setPaymentLaunched(false); }}
                style={{
                  background: "none",
                  border: "1px solid #444",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  color: "var(--muted)",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Amount */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <p style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-body)", margin: "0 0 4px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Amount Due
              </p>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 8vw, 2.8rem)",
                  letterSpacing: "-0.02em",
                  color: "var(--accent)",
                  margin: 0,
                }}
              >
                ₹{payData.amount?.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Mobile: UPI button / Desktop: QR */}
            {isMobile ? (
              <div style={{ marginBottom: "20px" }}>
                {!paymentLaunched ? (
                  <>
                    <button
                      onClick={payNow}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      style={{
                        width: "100%",
                        height: "52px",
                        background: "var(--accent)",
                        color: "#000",
                        border: "none",
                        borderRadius: "4px",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "transform 0.15s ease",
                        boxSizing: "border-box",
                      }}
                    >
                      Pay ₹{payData.amount?.toLocaleString("en-IN")} Now
                    </button>
                    <p style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
                      Opens Google Pay · PhonePe · Paytm
                    </p>
                  </>
                ) : (
                  <div
                    style={{
                      padding: "14px 16px",
                      background: "rgba(74, 222, 128, 0.1)",
                      border: "1px solid rgba(74,222,128,0.3)",
                      borderRadius: "4px",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ color: "#4ade80", fontSize: "14px", fontFamily: "var(--font-body)", margin: 0, lineHeight: 1.5 }}>
                      Payment app opened — confirm below once you've completed the transfer
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: "20px", textAlign: "center" }}>
                {payData.qrBase64 ? (
                  <>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "12px",
                        background: "#fff",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src={`data:image/png;base64,${payData.qrBase64}`}
                        alt="UPI QR Code"
                        width={180}
                        height={180}
                        style={{ display: "block" }}
                      />
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "var(--font-body)", margin: 0 }}>
                      Scan with any UPI app to pay
                    </p>
                  </>
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      background: "var(--bg)",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                      UPI ID: <strong style={{ color: "var(--text)" }}>{payData.upiId}</strong>
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "13px", margin: "6px 0 0", lineHeight: 1.5 }}>
                      Open any UPI app, pay to the above ID, then confirm below.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div style={{ height: "1px", background: "#333", marginBottom: "20px" }} />

            {/* Confirm section */}
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
                margin: "0 0 10px",
              }}
            >
              Confirm Payment
            </p>
            <input
              type="text"
              placeholder="UPI Transaction ID (optional)"
              value={upiTxnId}
              onChange={(e) => setUpiTxnId(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                height: "48px",
                padding: "0 14px",
                background: "var(--bg)",
                border: "1.5px solid #333",
                borderRadius: "4px",
                color: "var(--text)",
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                outline: "none",
                marginBottom: "12px",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
            />
            <button
              onClick={confirmOrder}
              disabled={confirming}
              onMouseEnter={(e) => { if (!confirming) e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => { if (!confirming) e.currentTarget.style.transform = "scale(1.02)"; }}
              style={{
                width: "100%",
                height: "52px",
                background: confirming ? "#555" : "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "15px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                cursor: confirming ? "not-allowed" : "pointer",
                transition: "transform 0.15s ease",
                boxSizing: "border-box",
              }}
            >
              {confirming ? "Confirming…" : "I've Paid — Confirm Order"}
            </button>
          </div>
        </div>
      )}

      {/* ─── Success Overlay ─── */}
      {paid && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: "12px",
              padding: "40px 28px",
              width: "100%",
              maxWidth: "400px",
              boxSizing: "border-box",
              border: "1px solid #333",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                background: "rgba(74,222,128,0.12)",
                border: "2px solid #4ade80",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                color: "var(--text)",
                margin: "0 0 8px",
              }}
            >
              Order Confirmed!
            </h2>

            {payData?.orderId && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "var(--muted)",
                  margin: "0 0 6px",
                }}
              >
                Order #{payData.orderId.slice(-8).toUpperCase()}
              </p>
            )}

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                color: "var(--muted)",
                margin: "0 0 28px",
                lineHeight: 1.6,
              }}
            >
              We'll ship your models soon. Expect delivery in 3–7 business days.
            </p>

            <div
              style={{
                padding: "14px 16px",
                background: "var(--bg)",
                borderRadius: "4px",
                marginBottom: "24px",
              }}
            >
              <p style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-body)", margin: 0, lineHeight: 1.5 }}>
                A confirmation email will be sent to <strong style={{ color: "var(--text)" }}>{email}</strong>
              </p>
            </div>

            <button
              onClick={() => router.push("/")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                width: "100%",
                height: "52px",
                background: "var(--accent)",
                color: "#000",
                border: "none",
                borderRadius: "4px",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "transform 0.15s ease",
                boxSizing: "border-box",
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}