"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const allProducts = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "Maisto Chevrolet Camaro SS RS 1:24 Die-Cast Model Car",
    description: "Vibrant lemon yellow Chevrolet Camaro die-cast model with iconic black racing stripes.",
    price: 299,
    specs: [
      { label: "Scale", value: "1:24" },
      { label: "Material", value: "Die-cast metal with plastic parts" },
      { label: "Color", value: "Yellow with black racing stripes" },
      { label: "Doors", value: "Opening doors" },
      { label: "Recommended Age", value: "3+ years" },
    ],
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Centy Toys Mahindra Thar Die-Cast Model Car",
    description: "Vibrant red, detailed die-cast Mahindra Thar SUV model for collectors.",
    price: 399,
    specs: [
      { label: "Scale", value: "1:36 approx" },
      { label: "Material", value: "Die-cast metal with plastic parts" },
      { label: "Color", value: "Red with black accents" },
      { label: "Features", value: "Pull-back action" },
      { label: "Recommended Age", value: "3+ years" },
    ],
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "Centy Toys Tata Nexon Die-Cast Model Car",
    description: "Highly detailed Tata Nexon die-cast model car, perfect for collectors and enthusiasts.",
    price: 499,
    specs: [
      { label: "Scale", value: "1:36 approx" },
      { label: "Material", value: "Die-cast metal with plastic parts" },
      { label: "Color", value: "Blue with black dual-tone roof" },
      { label: "Features", value: "Pull-back action" },
      { label: "Recommended Age", value: "3+ years" },
    ],
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "Welly Lamborghini Aventador LP 700-4 1:24 Die-Cast Model Car",
    description: "Highly detailed metallic papaya orange Lamborghini Aventador LP 700-4 die-cast model.",
    price: 599,
    specs: [
      { label: "Scale", value: "1:24" },
      { label: "Material", value: "Die-cast metal with plastic parts" },
      { label: "Color", value: "Orange with black wheels" },
      { label: "Doors", value: "Opening scissor-style doors" },
      { label: "Recommended Age", value: "3+ years" },
    ],
  },
];

const reviews = [
  { name: "Arjun M.", date: "12 Jan 2025", rating: 5, text: "Absolutely stunning detail on the Camaro. The racing stripes are crisp, the doors open smoothly, and the alloy wheels look like the real thing. Worth every rupee for a collector." },
  { name: "Priya R.", date: "03 Mar 2025", rating: 5, text: "Bought this as a gift for my husband who's a die-hard Camaro fan. He was blown away by the quality. The lemon yellow finish under the light is mesmerizing." },
  { name: "Rohan K.", date: "28 Feb 2025", rating: 4, text: "Great model car. Excellent detail work. Packaging was good too. Only minor issue: one door hinge feels slightly loose, but overall very happy with the purchase." },
  { name: "Meera S.", date: "15 Feb 2025", rating: 5, text: "As a serious collector, I have high standards. This Camaro exceeded them. The proportions are accurate, the paint job is flawless, and it feels premium. Definitely recommending to friends." },
  { name: "Vikram P.", date: "08 Feb 2025", rating: 4, text: "Solid die-cast model. Good weight, feels durable. The wheels roll smoothly. Would have preferred a display stand, but the model itself is perfect." },
];

const colors = ["Yellow", "Silver", "Black", "Red"];
const sizes = ["1:24 Standard"];

const tickerItems = [
  "1:18 SCALE PRECISION",
  "DIE-CAST METAL",
  "500+ MODELS",
  "FREE SHIPPING ABOVE ₹999",
  "COLLECTOR GRADE",
  "MADE IN INDIA",
  "TRUSTED BY 10,000+ COLLECTORS",
  "AUTHENTIC DETAIL",
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ProductDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [activeTab, setActiveTab] = useState("specs");
  const [addedToCart, setAddedToCart] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const paramImg = searchParams.get("img");
  const paramName = searchParams.get("name") ?? "Product";
  const paramPrice = searchParams.get("price");

  const displayImg = paramImg ?? "/product-1.jpg";
  const displayPrice = paramPrice ? parseInt(paramPrice) : 299;

  const currentProduct = allProducts.find(p => p.img === displayImg) ?? allProducts[0];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes ticker {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .ticker-track {
        animation: ticker 24s linear infinite;
        display: flex;
        width: max-content;
      }
      .ticker-track:hover {
        animation-play-state: paused;
      }
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.85); }
      }
      .reveal { }
      .will-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1); }
      .visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(styleEl);

    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach(el => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver((entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.remove("will-reveal");
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }), { threshold: 0.08 });
    els.forEach(el => io.observe(el));

    return () => {
      io.disconnect();
      document.head.removeChild(styleEl);
    };
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: crypto.randomUUID(),
      name: paramName,
      price: displayPrice,
      quantity: quantity,
      image: displayImg,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const tickerString = tickerItems.map(t => `${t} · `).join("");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <Navbar />

      {/* ── HERO: Asymmetric 55/45 Split ── */}
      <section style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "55fr 45fr",
        minHeight: isMobile ? "auto" : "90vh",
        background: "#111111",
      }}>
        {/* Left: Brand + Product Info */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "80px 24px 48px" : "80px 64px 80px 80px",
          position: "relative",
        }}>
          {/* Eyebrow */}
          <p style={{
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--accent)",
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            marginBottom: "24px",
          }}>
            {currentProduct.specs[0]?.value ?? "1:24"} · Die-Cast Metal · Collector Grade
          </p>

          {/* Wordmark */}
          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            lineHeight: 0.92,
            color: "#FFFFFF",
            marginBottom: "32px",
          }}>
            TOY<br />
            <span style={{ color: "var(--accent)" }}>WHEELS</span>
          </h1>

          {/* Product Name */}
          <p style={{
            fontSize: "14px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            fontFamily: "var(--font-heading)",
            fontWeight: 500,
            maxWidth: "360px",
            lineHeight: 1.6,
            marginBottom: "40px",
          }}>
            {paramName}
          </p>

          {/* Price + Trust */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
              <span style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                fontFamily: "var(--font-heading)",
                color: "var(--accent)",
              }}>
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              <span style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                textDecoration: "line-through",
                fontFamily: "var(--font-heading)",
              }}>
                ₹{(displayPrice * 1.2).toLocaleString("en-IN")}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1,2,3,4,5].map(i => <StarIcon key={i} filled={true} />)}
              </div>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-heading)" }}>
                4.8 · 187 reviews
              </span>
            </div>
          </div>

          {/* Color Selector */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-heading)", marginBottom: "12px" }}>
              Finish
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: "8px 16px",
                    border: selectedColor === color ? "1.5px solid var(--accent)" : "1.5px solid rgba(255,255,255,0.2)",
                    background: selectedColor === color ? "var(--accent)" : "transparent",
                    color: selectedColor === color ? "#111" : "rgba(255,255,255,0.7)",
                    fontFamily: "var(--font-heading)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    borderRadius: "2px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-heading)", marginBottom: "12px" }}>
              Quantity
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0", border: "1.5px solid rgba(255,255,255,0.2)", display: "inline-flex" }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: "40px", height: "40px", background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px", fontFamily: "var(--font-heading)" }}
              >−</button>
              <span style={{ width: "48px", textAlign: "center", fontFamily: "var(--font-heading)", fontWeight: 700, color: "#fff", fontSize: "16px" }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ width: "40px", height: "40px", background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px", fontFamily: "var(--font-heading)" }}
              >+</button>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={handleAddToCart}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                padding: "16px 36px",
                background: addedToCart ? "#2a2a2a" : "var(--accent)",
                color: "#111111",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "transform 0.15s ease, background 0.2s ease",
              }}
            >
              {addedToCart ? "✓ ADDED" : "ADD TO CART"}
            </button>
            <button
              onClick={() => router.push("/checkout")}
              onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#111"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}
              style={{
                padding: "16px 36px",
                background: "transparent",
                color: "#ffffff",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "1.5px solid rgba(255,255,255,0.5)",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
            >
              BUY NOW
            </button>
          </div>

          {/* Free shipping signal */}
          <p style={{ marginTop: "20px", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-heading)", letterSpacing: "0.06em" }}>
            FREE SHIPPING ABOVE ₹999 · COLLECTOR PACKAGING
          </p>
        </div>

        {/* Right: Product Image at 45° angle, bleeding off edge */}
        {!isMobile && (
          <div style={{
            position: "relative",
            overflow: "hidden",
            background: "#111111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Subtle accent glow behind car */}
            <div style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(247,224,30,0.12) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 0,
            }} />
            <div style={{ overflow: "hidden", position: "relative", zIndex: 1 }}>
              <img
                src={displayImg}
                alt={paramName}
                style={{
                  width: "110%",
                  maxWidth: "680px",
                  objectFit: "contain",
                  transform: "rotate(-12deg) scale(1.15) translateX(8%)",
                  transition: "transform 0.8s ease",
                  filter: "drop-shadow(0 24px 60px rgba(0,0,0,0.6))",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "rotate(-10deg) scale(1.2) translateX(8%)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "rotate(-12deg) scale(1.15) translateX(8%)")}
              />
            </div>
            {/* Accent stripe on right edge */}
            <div style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              background: "var(--accent)",
            }} />
          </div>
        )}

        {/* Mobile hero image */}
        {isMobile && (
          <div style={{ background: "#111", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
            <img
              src={displayImg}
              alt={paramName}
              style={{ width: "85%", objectFit: "contain", transform: "rotate(-8deg) scale(1.05)", filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.5))" }}
            />
          </div>
        )}
      </section>

      {/* ── TRUST TICKER BAND ── */}
      <div style={{
        background: "#111111",
        height: "48px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div className="ticker-track">
          {[...Array(4)].map((_, rep) => (
            tickerItems.map((item, i) => (
              <span key={`${rep}-${i}`} style={{
                fontFamily: "var(--font-heading)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#ffffff",
                whiteSpace: "nowrap",
                padding: "0 32px",
              }}>
                {item}
                <span style={{ color: "var(--accent)", marginLeft: "32px" }}>·</span>
              </span>
            ))
          ))}
        </div>
      </div>

      {/* ── PRODUCT THUMBNAILS RAIL ── */}
      <section className="reveal" style={{ background: "var(--bg)", padding: "48px 0 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "20px",
          }}>
            Also available in
          </p>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "12px" }}>
            {allProducts.map(product => (
              <button
                key={product.id}
                onClick={() => router.push(`/product?img=${encodeURIComponent(product.img)}&name=${encodeURIComponent(product.name)}&price=${product.price}`)}
                style={{
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  border: product.img === displayImg ? "2px solid var(--accent)" : "2px solid transparent",
                  background: "#fff",
                  borderRadius: "4px",
                  padding: "8px",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={e => { if (product.img !== displayImg) e.currentTarget.style.borderColor = "rgba(247,224,30,0.5)"; }}
                onMouseLeave={e => { if (product.img !== displayImg) e.currentTarget.style.borderColor = "transparent"; }}
              >
                <img src={product.img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECS / REVIEWS TABS ── */}
      <section className="reveal" style={{ background: "var(--bg)", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          {/* Tab nav */}
          <div style={{ display: "flex", gap: "0", borderBottom: "2px solid rgba(26,26,26,0.1)", marginBottom: "48px" }}>
            {["specs", "reviews"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "16px 32px",
                  fontFamily: "var(--font-heading)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
                  color: activeTab === tab ? "var(--text)" : "var(--muted)",
                  cursor: "pointer",
                  marginBottom: "-2px",
                  transition: "color 0.2s ease, border-color 0.2s ease",
                }}
              >
                {tab === "specs" ? "SPECIFICATIONS" : "REVIEWS (187)"}
              </button>
            ))}
          </div>

          {activeTab === "specs" && (
            <div style={{ maxWidth: "680px" }}>
              {currentProduct.specs.map((spec, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 0",
                  borderBottom: "1px solid rgba(26,26,26,0.08)",
                }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
                    {spec.label}
                  </span>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "760px" }}>
              {/* Rating summary */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                padding: "32px",
                background: "#111",
                borderRadius: "2px",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "4rem", fontWeight: 900, color: "var(--accent)", lineHeight: 1 }}>4.8</div>
                  <div style={{ display: "flex", gap: "2px", justifyContent: "center", margin: "8px 0 4px" }}>
                    {[1,2,3,4,5].map(i => <StarIcon key={i} filled={true} />)}
                  </div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>187 REVIEWS</div>
                </div>
                <div style={{ flex: 1, borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "24px" }}>
                  {[5,4,3,2,1].map(star => (
                    <div key={star} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <span style={{ fontFamily: "var(--font-heading)", fontSize: "11px", color: "rgba(255,255,255,0.5)", width: "16px" }}>{star}</span>
                      <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                        <div style={{
                          height: "100%",
                          width: star === 5 ? "78%" : star === 4 ? "15%" : star === 3 ? "5%" : "1%",
                          background: "var(--accent)",
                          borderRadius: "2px",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {reviews.map((review, idx) => (
                <div key={idx} style={{
                  paddingBottom: "40px",
                  borderBottom: "1px solid rgba(26,26,26,0.08)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "14px", color: "var(--text)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {review.name}
                      </div>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "11px", color: "var(--muted)", letterSpacing: "0.08em", marginTop: "2px" }}>
                        {review.date}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} />)}
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.75, color: "var(--text)", opacity: 0.8 }}>
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CROWD FAVOURITES — 3-col MINIMAL_BELOW grid ── */}
      <section className="reveal" id="crowd-favourites" style={{ background: "#F5F5F0", paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          {/* Section headline */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "56px" }}>
            <div style={{ width: "4px", height: "48px", background: "var(--accent)", flexShrink: 0 }} />
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              color: "#111111",
              lineHeight: 0.95,
            }}>
              CROWD<br />FAVOURITES
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "2px",
          }}>
            {allProducts.map(p => (
              <article
                key={p.id}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                style={{
                  cursor: "pointer",
                  background: "#ffffff",
                  padding: "0",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(247,224,30,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Square product cut-out on white */}
                <div style={{ overflow: "hidden", aspectRatio: "1/1", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      transition: "transform 0.6s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                {/* MINIMAL_BELOW card info */}
                <div style={{ padding: "16px 20px 24px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <p style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#111",
                    marginBottom: "6px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {p.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 900, color: "var(--accent)", background: "#111", padding: "2px 8px" }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={ev => {
                        ev.stopPropagation();
                        addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
                      }}
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        background: "transparent",
                        border: "1.5px solid #111",
                        color: "#111",
                        padding: "6px 12px",
                        cursor: "pointer",
                        borderRadius: "2px",
                        transition: "background 0.2s ease, color 0.2s ease",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "var(--accent)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#111"; }}
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                padding: "16px 48px",
                background: "#111111",
                color: "var(--accent)",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
            >
              VIEW ALL MODELS
            </button>
          </div>
        </div>
      </section>

      {/* ── ASYMMETRIC SPLIT: Feature Centrepiece ── */}
      <section className="reveal" style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "60fr 40fr",
        minHeight: "520px",
      }}>
        {/* Left: Full-bleed product at 45° */}
        <div style={{
          background: "#F5F5F0",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(247,224,30,0.15) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }} />
          <img
            src={displayImg}
            alt={paramName}
            style={{
              width: "100%",
              maxWidth: "480px",
              objectFit: "contain",
              transform: "rotate(-15deg) scale(1.1)",
              filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.2))",
              position: "relative",
              zIndex: 1,
              transition: "transform 0.8s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "rotate(-10deg) scale(1.15)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "rotate(-15deg) scale(1.1)")}
          />
        </div>

        {/* Right: Editorial block on dark */}
        <div style={{
          background: "#111111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "64px 24px" : "64px 56px",
        }}>
          {/* Overline */}
          <p style={{
            fontFamily: "var(--font-heading)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "24px",
          }}>
            1:18 SCALE
          </p>

          {/* Headline */}
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "#ffffff",
            marginBottom: "24px",
          }}>
            Engineered<br />to the Last<br />
            <span style={{ color: "var(--accent)" }}>Bolt.</span>
          </h2>

          {/* Body */}
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.5)",
            marginBottom: "40px",
            maxWidth: "340px",
          }}>
            Every panel gap, every wheel arch, every interior stitch — replicated with obsessive precision. This is not a toy. This is a tribute.
          </p>

          {/* Ghost CTA */}
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#111"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "transparent",
              color: "#ffffff",
              border: "1.5px solid rgba(255,255,255,0.4)",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
              alignSelf: "flex-start",
            }}
          >
            EXPLORE THE RANGE
          </button>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "32px", marginTop: "56px", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[["500+", "MODELS"], ["10K+", "COLLECTORS"], ["1:18", "PRECISION"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)", lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND MANIFESTO BAND ── */}
      <section className="reveal" style={{ background: "var(--bg)", padding: "96px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "24px",
          }}>
            OUR MANIFESTO
          </p>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "var(--text)",
            marginBottom: "32px",
            textTransform: "uppercase",
          }}>
            We sell<br />
            <span style={{ WebkitTextStroke: "2px var(--text)", color: "transparent" }}>HAPPINESS</span><br />
            one die-cast<br />at a time.
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "17px",
            lineHeight: 1.8,
            color: "var(--text)",
            opacity: 0.65,
            maxWidth: "600px",
          }}>
            Every model in our catalog is chosen by a fellow collector — someone who knows the difference between a 1:18 and a 1:24, who checks the door hinge tolerance and the wheel arch accuracy before anything else. toywheels is for the obsessed.
          </p>
        </div>
      </section>

      {/* ── NEWSLETTER BAND ── */}
      <section className="reveal" style={{ background: "#111111", padding: "96px 24px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "24px",
          }}>
            NEW ARRIVALS WEEKLY
          </p>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            textTransform: "uppercase",
            color: "#ffffff",
            marginBottom: "48px",
          }}>
            DRIVE FIRST.<br />KNOW FIRST.
          </h2>

          <form
            onSubmit={e => { e.preventDefault(); setSubscribed(true); }}
            style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "0", maxWidth: "560px", margin: "0 auto" }}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="YOUR EMAIL ADDRESS"
              required
              style={{
                flex: 1,
                padding: "18px 24px",
                background: "transparent",
                border: "none",
                borderBottom: "1.5px solid rgba(255,255,255,0.3)",
                color: "#ffffff",
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                letterSpacing: "0.1em",
                outline: "none",
                borderRadius: "0",
              }}
            />
            <button
              type="submit"
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                padding: "18px 32px",
                background: subscribed ? "#2a2a2a" : "var(--accent)",
                color: "#111111",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "transform 0.15s ease",
                marginTop: isMobile ? "16px" : "0",
                whiteSpace: "nowrap",
              }}
            >
              {subscribed ? "✓ SUBSCRIBED" : "SUBSCRIBE"}
            </button>
          </form>
          <p style={{ marginTop: "20px", fontFamily: "var(--font-heading)", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>
            NO SPAM. ONLY DROPS, DEALS & COLLECTOR NEWS.
          </p>
        </div>
      </section>

      <Footer />

      {/* ── STICKY MOBILE ADD TO CART BAR ── */}
      {isMobile && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 20px",
          background: "#111111",
          borderTop: "2px solid var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 50,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Total</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 900, color: "var(--accent)" }}>₹{displayPrice.toLocaleString("en-IN")}</div>
          </div>
          <button
            onClick={handleAddToCart}
            style={{
              padding: "14px 28px",
              background: addedToCart ? "rgba(247,224,30,0.7)" : "var(--accent)",
              color: "#111111",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            {addedToCart ? "✓ ADDED" : "ADD TO CART"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)" }}>
          LOADING…
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  );
}