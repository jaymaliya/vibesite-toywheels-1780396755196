"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Maisto Chevrolet Camaro SS RS 1:24 Die-Cast Model Car", description: "Vibrant lemon yellow Chevrolet Camaro die-cast model with iconic black racing stripes.", price: 299, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Centy Toys Mahindra Thar Die-Cast Model Car", description: "Vibrant red, detailed die-cast Mahindra Thar SUV model for collectors.", price: 399, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Centy Toys Tata Nexon Die-Cast Model Car", description: "Highly detailed Tata Nexon die-cast model car, perfect for collectors and enthusiasts.", price: 499, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Welly Lamborghini Aventador LP 700-4 1:24 Die-Cast Model Car", description: "Highly detailed metallic papaya orange Lamborghini Aventador LP 700-4 die-cast model.", price: 599, badge: "" }
];

const tickerItems = [
  "1:24 SCALE",
  "DIE-CAST METAL",
  "OPENING DOORS",
  "LICENSED MODELS",
  "HAND-PAINTED DETAIL",
  "COLLECTOR GRADE",
  "500+ MODELS IN STOCK",
  "FREE SHIPPING ABOVE ₹999",
  "OFFICIALLY LICENSED",
  "PRECISION ENGINEERED",
];

type Product = typeof products[0];

export default function ShopPage() {
  const router = useRouter();
  const { addItem, totalItems } = useCart() ?? { addItem: () => {}, totalItems: 0 };

  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleAddToCart = (p: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [p.id]: false })), 1500);
  };

  const handleSubscribe = async () => {
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSubscribed(true);
    setEmail("");
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  useEffect(() => {
    if (quickView) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [quickView]);

  const navLinks = ["MODELS", "NEW ARRIVALS", "BRANDS", "ABOUT", "CONTACT", "ACCOUNT"];

  return (
    <div style={{ background: "#111111", color: "#F2F2F2", fontFamily: "'DM Serif Display', serif", overflowX: "hidden", minHeight: "100vh" }}>

      {/* ── CUSTOM NAV ── */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "56px",
        background: "#111111",
        borderBottom: "1px solid #2a2a2a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
      }}>
        {/* Logo flush left */}
        <div onClick={() => router.push("/")} style={{ cursor: "pointer", flexShrink: 0 }}>
          <img src="/logo.png" alt="ToyWheels logo" style={{ height: "32px", objectFit: "contain" }} />
        </div>

        {/* Desktop nav — single right-aligned row */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {navLinks.map((label) => (
              <button
                key={label}
                onClick={() => {
                  if (label === "MODELS" || label === "NEW ARRIVALS" || label === "BRANDS") router.push("/shop");
                  else if (label === "ACCOUNT") router.push("/");
                  else document.getElementById("newsletter-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#888888",
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: 0,
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F7E01E")}
                onMouseLeave={e => (e.currentTarget.style.color = "#888888")}
              >
                {label}
              </button>
            ))}
            {/* Cart icon */}
            <button
              onClick={() => router.push("/checkout")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#F2F2F2",
                position: "relative",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  background: "#F7E01E",
                  color: "#111111",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  fontSize: "0.6rem",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Clash Display', sans-serif",
                }}>
                  {totalItems}
                </span>
              )}
            </button>
          </nav>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => router.push("/checkout")} style={{ background: "none", border: "none", cursor: "pointer", color: "#F2F2F2", position: "relative", padding: "4px", display: "flex" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "#F7E01E", color: "#111111", borderRadius: "50%", width: "16px", height: "16px", fontSize: "0.6rem", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Clash Display', sans-serif" }}>{totalItems}</span>
              )}
            </button>
            <button onClick={() => setMobileNavOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#F2F2F2", padding: "4px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{ width: "22px", height: "2px", background: "#F2F2F2", display: "block" }} />
              <span style={{ width: "22px", height: "2px", background: "#F2F2F2", display: "block" }} />
              <span style={{ width: "14px", height: "2px", background: "#F2F2F2", display: "block" }} />
            </button>
          </div>
        )}
      </header>

      {/* Mobile nav overlay */}
      {mobileNavOpen && isMobile && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#111111", display: "flex", flexDirection: "column", padding: "32px", gap: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <img src="/logo.png" alt="ToyWheels logo" style={{ height: "32px", objectFit: "contain" }} />
            <button onClick={() => setMobileNavOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#F2F2F2", fontSize: "24px", lineHeight: 1 }}>✕</button>
          </div>
          {navLinks.map((label) => (
            <button key={label} onClick={() => { setMobileNavOpen(false); router.push("/shop"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#F2F2F2", fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase", textAlign: "left", padding: 0 }}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── HERO: HARD SPLIT — left #111111, right full-bleed photo ── */}
      {!isMobile ? (
        <section style={{
          position: "relative",
          width: "100%",
          minHeight: "90vh",
          display: "grid",
          gridTemplateColumns: "45vw 55vw",
          overflow: "hidden",
        }}>
          {/* Left panel — pure #111111, no gradient */}
          <div style={{
            background: "#111111",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 56px",
            zIndex: 2,
          }}>
            <p style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#F7E01E",
              marginBottom: "24px",
            }}>
              THE FULL CATALOGUE
            </p>
            <h1 style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(4rem, 9vw, 9rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              color: "#F2F2F2",
              marginBottom: "32px",
            }}>
              EVERY<br />
              <span style={{ color: "#F7E01E" }}>MODEL.</span><br />
              EVERY<br />
              DETAIL.
            </h1>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "15px",
              color: "#888888",
              lineHeight: 1.7,
              maxWidth: "360px",
              marginBottom: "36px",
            }}>
              Precision die-cast replicas for collectors who live the legend. Licensed, detailed, built to last.
            </p>
            {/* Trust row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", fontSize: "12px", color: "#888888", fontFamily: "'Clash Display', sans-serif", letterSpacing: "0.08em", marginBottom: "40px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#F7E01E"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                4.8 · 10,000+ Collectors
              </span>
              <span>Free Shipping ₹999+</span>
              <span>Official Licensed Models</span>
            </div>
            <button
              onClick={() => document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "#F7E01E",
                color: "#111111",
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 900,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: 0,
                padding: "18px 40px",
                cursor: "pointer",
                width: "fit-content",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Shop the Collection
            </button>
          </div>

          {/* Right panel — photo bleeds full-height, zero fade */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <img
              src="/product-1.jpg"
              alt="Featured Maisto Chevrolet Camaro Die-Cast Model"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        </section>
      ) : (
        /* ── MOBILE HERO: full-bleed bg, bottom-anchored text ── */
        <section style={{
          position: "relative",
          width: "100%",
          minHeight: "100svh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}>
          <img
            src="/product-1.jpg"
            alt="Featured Maisto Chevrolet Camaro Die-Cast Model"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center right",
            }}
          />
          {/* Bottom-anchored solid text block */}
          <div style={{
            position: "relative",
            zIndex: 2,
            background: "#111111",
            padding: "48px 24px",
          }}>
            <p style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#F7E01E",
              marginBottom: "16px",
            }}>
              THE FULL CATALOGUE
            </p>
            <h1 style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(3rem, 12vw, 5rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              color: "#F2F2F2",
              marginBottom: "24px",
            }}>
              EVERY<br />
              <span style={{ color: "#F7E01E" }}>MODEL.</span><br />
              EVERY<br />
              DETAIL.
            </h1>
            <button
              onClick={() => document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "#F7E01E",
                color: "#111111",
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 900,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: 0,
                padding: "16px 32px",
                cursor: "pointer",
                width: "100%",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Shop the Collection
            </button>
          </div>
        </section>
      )}

      {/* ── MARQUEE TICKER — sharp black-on-yellow ── */}
      <div style={{
        background: "#F7E01E",
        overflow: "hidden",
        padding: "10px 0",
        borderTop: "2px solid #111111",
        borderBottom: "2px solid #111111",
      }}>
        <div style={{
          display: "flex",
          width: "max-content",
          animation: "ticker 28s linear infinite",
        }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#111111",
                padding: "0 24px",
                display: "inline-flex",
                alignItems: "center",
                gap: "24px",
                whiteSpace: "nowrap",
              }}
            >
              {item}
              {/* Solid #111111 circle separator, 4px */}
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#111111", display: "inline-block", flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <section id="product-grid" className="reveal" style={{ padding: isMobile ? "48px 16px" : "80px 40px", maxWidth: "1380px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "48px" }}>
          <h2 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.015em",
            color: "#F2F2F2",
          }}>
            CROWD FAVOURITES
          </h2>
          <p style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#888888",
          }}>
            {products.length} MODELS
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1px",
          background: "#2a2a2a",
          border: "1px solid #2a2a2a",
        }}>
          {products.map((p) => (
            <article
              key={p.id}
              style={{
                background: "#1a1a1a",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
              onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {p.badge && (
                <div style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  zIndex: 3,
                  background: "#F7E01E",
                  color: "#111111",
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "4px 8px",
                  borderRadius: 0,
                }}>
                  {p.badge}
                </div>
              )}

              {/* White-square-on-dark: product image on white bg */}
              <div style={{ overflow: "hidden", background: "#FFFFFF", aspectRatio: "1/1" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>

              {/* Card info */}
              <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                {/* Product name — uppercase, 0.7rem, #888888, above price */}
                <p style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#888888",
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  {p.name}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "16px" }}>
                  <span style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#F7E01E",
                    letterSpacing: "-0.01em",
                  }}>
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>

                  {/* Flat yellow square button — no gradient, no shadow, no radius */}
                  <button
                    onClick={(e) => handleAddToCart(p, e)}
                    style={{
                      background: "#F7E01E",
                      color: "#111111",
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: "0.65rem",
                      fontWeight: 900,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      border: "none",
                      borderRadius: 0,
                      padding: "10px 16px",
                      cursor: "pointer",
                      boxShadow: "none",
                      transition: "transform 0.15s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  >
                    {addedIds[p.id] ? "✓ ADDED" : "ADD TO CART"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── FEATURE TRIO ── */}
      <section className="reveal" style={{ padding: isMobile ? "48px 16px" : "0 40px 80px", maxWidth: "1380px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "1px",
          background: "#2a2a2a",
          border: "1px solid #2a2a2a",
        }}>
          {[
            { label: "Die-Cast Metal", desc: "Every model is precision-cast zinc alloy — the same material used by the official manufacturers.", icon: "⬡" },
            { label: "1:24 Scale", desc: "True-to-dimension replicas accurate to within 1mm. Built for the serious collector, not the shelf filler.", icon: "◎" },
            { label: "Opening Doors", desc: "Functioning doors, hoods, and trunks reveal meticulously detailed interiors on every model.", icon: "◱" },
          ].map((feat, i) => (
            <div key={i} style={{ background: "#1a1a1a", padding: "40px 32px" }}>
              <div style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#F7E01E",
                marginBottom: "16px",
              }}>
                0{i + 1}
              </div>
              <h3 style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "1.4rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                color: "#F2F2F2",
                marginBottom: "12px",
              }}>
                {feat.label}
              </h3>
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "14px",
                color: "#888888",
                lineHeight: 1.7,
                margin: 0,
              }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRAND MANIFESTO — hard 50/50 split, no overlay ── */}
      <section className="reveal" style={{
        width: "100%",
        display: isMobile ? "flex" : "grid",
        flexDirection: isMobile ? "column" : undefined,
        gridTemplateColumns: isMobile ? undefined : "50% 50%",
        minHeight: isMobile ? "auto" : "60vh",
        overflow: "hidden",
      }}>
        {/* Left: solid #111111 with headline */}
        <div style={{
          background: "#111111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "48px 24px" : "80px 64px",
          borderTop: "1px solid #2a2a2a",
          borderBottom: "1px solid #2a2a2a",
        }}>
          <p style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#F7E01E",
            marginBottom: "24px",
          }}>
            THE TOYWHEELS STANDARD
          </p>
          <h2 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 5rem)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.025em",
            lineHeight: 0.95,
            color: "#F2F2F2",
            marginBottom: "32px",
          }}>
            BUILT TO<br />
            IMPRESS.<br />
            <span style={{ color: "#F7E01E" }}>MADE TO</span><br />
            COLLECT.
          </h2>
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "15px",
            color: "#888888",
            lineHeight: 1.8,
            maxWidth: "380px",
            marginBottom: "40px",
          }}>
            Every ToyWheels model passes 14-point collector-grade inspection before it reaches your shelf. Because a collection says something about the person behind it.
          </p>
          <button
            onClick={() => router.push("/shop")}
            style={{
              background: "#F7E01E",
              color: "#111111",
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 900,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              border: "none",
              borderRadius: 0,
              padding: "18px 40px",
              cursor: "pointer",
              width: "fit-content",
              boxShadow: "none",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
          >
            Explore All Models
          </button>
        </div>

        {/* Right: full-bleed product photo, zero overlay */}
        <div style={{ overflow: "hidden", minHeight: isMobile ? "320px" : "auto" }}>
          <img
            src="/product-2.jpg"
            alt="Centy Toys Mahindra Thar Die-Cast Model showcasing collector quality"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              transition: "transform 0.6s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
      </section>

      {/* ── HORIZONTAL RAIL: all models quick preview ── */}
      <section className="reveal" style={{ padding: isMobile ? "48px 0" : "80px 0", overflow: "hidden" }}>
        <div style={{ padding: isMobile ? "0 16px" : "0 40px", marginBottom: "32px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <h2 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            color: "#F2F2F2",
          }}>
            THE FULL LINEUP
          </h2>
          <button
            onClick={() => document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "none",
              border: "1px solid #2a2a2a",
              color: "#888888",
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "8px 20px",
              cursor: "pointer",
              borderRadius: 0,
              transition: "color 0.15s ease, border-color 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#F7E01E"; e.currentTarget.style.borderColor = "#F7E01E"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#888888"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
          >
            View All
          </button>
        </div>

        <div style={{
          display: "flex",
          gap: "1px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          padding: isMobile ? "0 16px" : "0 40px",
        }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                flex: "0 0 auto",
                width: isMobile ? "220px" : "280px",
                scrollSnapAlign: "start",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                cursor: "pointer",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
              onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ background: "#FFFFFF", overflow: "hidden", aspectRatio: "1/1" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "16px" }}>
                <p style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#888888",
                  marginBottom: "8px",
                  lineHeight: 1.4,
                }}>
                  {p.name}
                </p>
                <span style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#F7E01E",
                }}>
                  ₹{p.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section id="newsletter-section" className="reveal" style={{
        background: "#1a1a1a",
        borderTop: "1px solid #2a2a2a",
        borderBottom: "1px solid #2a2a2a",
        padding: isMobile ? "48px 24px" : "80px 40px",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#F7E01E",
            marginBottom: "16px",
          }}>
            COLLECTOR UPDATES
          </p>
          <h2 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
            color: "#F2F2F2",
            marginBottom: "16px",
          }}>
            NEW ARRIVALS.<br />FIRST ACCESS.
          </h2>
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "15px",
            color: "#888888",
            lineHeight: 1.7,
            marginBottom: "32px",
          }}>
            Get early access to limited drops, new scale announcements, and collector-grade deals. No spam — just the models you want to know about.
          </p>

          {subscribed ? (
            <div style={{
              background: "#111111",
              border: "1px solid #F7E01E",
              padding: "20px 32px",
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#F7E01E",
            }}>
              ✓ YOU'RE IN THE GARAGE
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1px", background: "#2a2a2a", flexDirection: isMobile ? "column" : "row" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  padding: "18px 20px",
                  background: "#111111",
                  border: "none",
                  color: "#F2F2F2",
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "15px",
                  outline: "none",
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />
              <button
                onClick={handleSubscribe}
                style={{
                  background: "#F7E01E",
                  color: "#111111",
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  border: "none",
                  borderRadius: 0,
                  padding: "18px 32px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              >
                Join the Garage
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      {quickView && (
        <div
          onClick={() => setQuickView(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              maxWidth: "640px",
              width: "100%",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              animation: "fadeScaleIn 0.22s ease-out forwards",
            }}
          >
            <div style={{ background: "#FFFFFF", overflow: "hidden", aspectRatio: "1/1" }}>
              <img src={quickView.img} alt={quickView.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <button
                onClick={() => setQuickView(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#888888", fontSize: "20px", alignSelf: "flex-end", padding: 0, lineHeight: 1 }}
              >
                ✕
              </button>
              <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888888", margin: 0 }}>
                {quickView.name}
              </p>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "13px", color: "#888888", lineHeight: 1.7, margin: 0 }}>
                {quickView.description}
              </p>
              <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#F7E01E" }}>
                ₹{quickView.price.toLocaleString("en-IN")}
              </span>
              <button
                onClick={() => { handleAddToCart(quickView); setQuickView(null); }}
                style={{
                  background: "#F7E01E",
                  color: "#111111",
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  border: "none",
                  borderRadius: 0,
                  padding: "16px",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                Add to Cart
              </button>
              <button
                onClick={() => { setQuickView(null); router.push(`/product?name=${encodeURIComponent(quickView.name)}&price=${quickView.price}&img=${encodeURIComponent(quickView.img)}`); }}
                style={{
                  background: "none",
                  border: "1px solid #2a2a2a",
                  color: "#888888",
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "12px",
                  cursor: "pointer",
                  borderRadius: 0,
                  transition: "color 0.15s ease, border-color 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#F2F2F2"; e.currentTarget.style.borderColor = "#F2F2F2"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#888888"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Global keyframe injection via dangerouslySetInnerHTML on a noscript — avoid style tags */}
      <div
        aria-hidden="true"
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{
          __html: `<style>
            @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');
            @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            @keyframes fadeScaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            .will-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.25,0.1,0.25,1), transform 0.65s cubic-bezier(0.25,0.1,0.25,1); }
            .visible { opacity: 1 !important; transform: none !important; }
            ::-webkit-scrollbar { display: none; }
            input::placeholder { color: #444444; }
            button:focus-visible { outline: 2px solid #F7E01E; outline-offset: 2px; }
            a:focus-visible { outline: 2px solid #F7E01E; outline-offset: 2px; }
          </style>`,
        }}
      />
    </div>
  );
}