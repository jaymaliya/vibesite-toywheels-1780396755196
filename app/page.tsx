"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
];

export default function HomePage() {
  const router = useRouter();
  const { addItem, totalItems } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, quantity: 1, image: p.img });
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
      setSubscribed(true);
      setEmail("");
    } catch {
      setSubscribed(true);
    }
  };

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

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        :root {
          --font-heading: 'Barlow Condensed', sans-serif;
          --font-body: 'DM Sans', sans-serif;
          --bg: #1A1A1A;
          --surface: #242424;
          --primary: #E61F27;
          --accent: #F7E01E;
          --text: #F2F2F2;
          --muted: #7A7A7A;
          --radius-sm: 2px;
          --radius-md: 4px;
          --radius-lg: 8px;
          --radius-pill: 999px;
          --shadow-xs: 0 1px 3px rgba(0,0,0,0.3);
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.35);
          --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
          --shadow-lg: 0 8px 32px rgba(0,0,0,0.45);
          --shadow-xl: 0 16px 48px rgba(0,0,0,0.5);
          --space-section: 96px;
          --transition-smooth: 300ms cubic-bezier(0.4,0,0.2,1);
        }
        .will-reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.6s cubic-bezier(0.25,0.1,0.25,1), transform 0.6s cubic-bezier(0.25,0.1,0.25,1); }
        .visible { opacity: 1; transform: translateY(0); }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { display: flex; animation: marquee 22s linear infinite; width: max-content; }
        .marquee-track:hover { animation-play-state: paused; }
        * { box-sizing: border-box; }
        body { margin: 0; }
        a { text-decoration: none; }
        button:focus-visible, a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      `}</style>

      <Navbar />

      {/* ═══ HERO — Full-bleed asymmetric with diagonal stripe ═══ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        {/* Diagonal racing stripe accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
          >
            <polygon
              points="380,900 520,900 620,0 480,0"
              fill="var(--accent)"
              opacity="1"
            />
            <polygon
              points="400,900 430,900 530,0 500,0"
              fill="var(--bg)"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Left content panel */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "50%",
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 48px 72px 56px",
          }}
          className="hero-left"
        >
          {/* Trust row */}
          <div style={{ marginBottom: 24, display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {["1:24 SCALE", "LICENSED MODEL", "DIE-CAST METAL"].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  border: "1px solid var(--accent)",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3.2rem, 8vw, 7rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 0.92,
              color: "var(--text)",
              margin: "0 0 8px 0",
            }}
          >
            OWN THE
            <br />
            <span style={{ color: "var(--accent)" }}>ROAD.</span>
            <br />
            OWN THE
            <br />
            <span style={{ color: "var(--primary)" }}>LEGEND.</span>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 400,
              lineHeight: 1.65,
              color: "var(--muted)",
              margin: "24px 0 32px 0",
              maxWidth: 380,
            }}
          >
            Collector-grade die-cast models. Every stripe, every bolt, every detail — precision-engineered for the obsessive few.
          </p>

          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "var(--accent)",
              color: "#000",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "18px 40px",
              cursor: "pointer",
              display: "inline-block",
              width: "fit-content",
              transition: "transform 0.15s ease",
              boxShadow: "var(--shadow-md)",
            }}
          >
            Shop the Collection
          </button>

          <p style={{ marginTop: 16, fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            Trusted by 10,000+ collectors worldwide · Free shipping above ₹999
          </p>
        </div>

        {/* Right image panel */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            overflow: "visible",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "110%",
              maxWidth: 820,
              marginRight: "-5%",
            }}
          >
            <img
              src="/product-1.jpg"
              alt="Maisto Chevrolet Camaro SS RS 1:24 Die-Cast — lemon yellow with twin black racing stripes"
              style={{
                width: "100%",
                objectFit: "contain",
                display: "block",
                filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.7))",
              }}
            />
          </div>
        </div>

        {/* Mobile hero layout override */}
        <style>{`
          @media (max-width: 768px) {
            .hero-left { width: 100% !important; padding: 0 24px 48px 24px !important; }
            section > div:last-child { display: none !important; }
          }
        `}</style>
      </section>

      {/* ═══ MARQUEE TICKER ═══ */}
      <div
        style={{
          background: "var(--accent)",
          overflow: "hidden",
          padding: "14px 0",
          borderTop: "3px solid #1A1A1A",
          borderBottom: "3px solid #1A1A1A",
        }}
      >
        <div className="marquee-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#000",
                padding: "0 40px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {item}
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--bg)", display: "inline-block" }} />
            </span>
          ))}
        </div>
      </div>

      {/* ═══ BENTO SHOWCASE — Collector's Detail Grid ═══ */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          padding: "var(--space-section) clamp(24px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 12,
              }}
            >
              Collector's Showcase
            </p>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color: "var(--text)",
                margin: 0,
              }}
            >
              Every Detail. Earned.
            </h2>
          </div>

          {/* Bento grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gridAutoRows: "220px",
              gap: 16,
            }}
          >
            {/* Large tile — hero product detail */}
            <div
              style={{
                gridColumn: "span 2",
                gridRow: "span 2",
                background: "#111",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                boxShadow: "var(--shadow-md)",
              }}
              onClick={() =>
                router.push(
                  `/product?name=${encodeURIComponent(products[0].name)}&price=${products[0].price}&img=${encodeURIComponent(products[0].img)}`
                )
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(247,224,30,0.18)";
                const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                if (img) img.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <img
                src="/product-1.jpg"
                alt="Chevrolet Camaro die-cast close-up — twin black racing stripes on lemon yellow hood"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "40px 28px 28px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                }}
              >
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", color: "var(--accent)", textTransform: "uppercase", margin: "0 0 6px 0" }}>Featured Model</p>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", margin: 0, textTransform: "uppercase", letterSpacing: "-0.01em" }}>
                  Chevrolet Camaro SS RS
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--muted)", margin: "6px 0 0 0" }}>1:24 Scale · Die-cast Metal</p>
              </div>
            </div>

            {/* Tile 2 — Lamborghini */}
            <div
              style={{
                background: "#111",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
              onClick={() =>
                router.push(
                  `/product?name=${encodeURIComponent(products[3].name)}&price=${products[3].price}&img=${encodeURIComponent(products[3].img)}`
                )
              }
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                if (img) img.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <img
                src="/product-4.jpg"
                alt="Lamborghini Aventador die-cast model in orange"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 16px", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", margin: 0, textTransform: "uppercase" }}>Lamborghini Aventador</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--accent)", margin: "4px 0 0 0", fontWeight: 700 }}>₹599</p>
              </div>
            </div>

            {/* Tile 3 — Specs highlight */}
            <div
              style={{
                background: "var(--primary)",
                borderRadius: "var(--radius-lg)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", margin: "0 0 16px 0" }}>Collector Specs</p>
              {["1:24 SCALE", "DIE-CAST METAL", "OPENING DOORS", "LICENSED MODEL", "HAND-PAINTED"].map((spec) => (
                <div key={spec} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>{spec}</span>
                </div>
              ))}
            </div>

            {/* Tile 4 — Thar */}
            <div
              style={{
                background: "#111",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
              onClick={() =>
                router.push(
                  `/product?name=${encodeURIComponent(products[1].name)}&price=${products[1].price}&img=${encodeURIComponent(products[1].img)}`
                )
              }
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                if (img) img.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <img
                src="/product-2.jpg"
                alt="Mahindra Thar red die-cast model"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 16px", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", margin: 0, textTransform: "uppercase" }}>Mahindra Thar</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--accent)", margin: "4px 0 0 0", fontWeight: 700 }}>₹399</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HORIZONTAL PRODUCT RAIL — Top Picks ═══ */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "var(--space-section) 0",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", margin: "0 0 10px 0" }}>
                Top Picks
              </p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1, color: "var(--text)", margin: 0 }}>
                Build Your Collection
              </h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "transparent",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
                borderRadius: "var(--radius-md)",
                padding: "12px 28px",
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
            >
              View All Models
            </button>
          </div>
        </div>

        {/* Rail with edge fade */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              overflowX: "auto",
              display: "flex",
              gap: 20,
              padding: "0 clamp(24px, 5vw, 80px) 24px",
              scrollSnapType: "x mandatory",
              msOverflowStyle: "none",
            }}
            className="hide-scrollbar"
          >
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { scrollbar-width: none; }`}</style>
            {products.map((p, i) => (
              <article
                key={p.id}
                style={{
                  flex: "0 0 auto",
                  width: "clamp(240px, 28vw, 300px)",
                  scrollSnapAlign: "start",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  transform: i % 2 === 1 ? "rotate(1deg)" : "rotate(-0.8deg)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px) rotate(0deg)";
                  e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(247,224,30,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = i % 2 === 1 ? "rotate(1deg)" : "rotate(-0.8deg)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                  )
                }
              >
                <div style={{ background: "#fff", overflow: "hidden", aspectRatio: "1/1" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "20px" }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 6px 0" }}>
                    Die-Cast Model
                  </p>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                    {p.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)" }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        background: addedIds[p.id] ? "var(--primary)" : "var(--accent)",
                        color: "#000",
                        border: "none",
                        borderRadius: "var(--radius-md)",
                        padding: "10px 18px",
                        cursor: "pointer",
                        transition: "transform 0.15s ease, background 0.2s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {addedIds[p.id] ? "✓ Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {/* Edge fades */}
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 24, width: 80, background: "linear-gradient(to right, var(--bg), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 24, width: 80, background: "linear-gradient(to left, var(--bg), transparent)", pointerEvents: "none" }} />
        </div>
      </section>

      {/* ═══ EDITORIAL STORY SPLIT — Asymmetric 60/40 ═══ */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          padding: "var(--space-section) clamp(24px, 5vw, 80px)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left — large image with clip-path diagonal cut */}
          <div
            style={{
              overflow: "hidden",
              borderRadius: "var(--radius-lg)",
              aspectRatio: "4/3",
              clipPath: "polygon(0% 0%, 96% 0%, 100% 100%, 0% 100%)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <img
              src="/product-3.jpg"
              alt="Tata Nexon die-cast model — blue with dual-tone roof, collector detail"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Right — editorial text */}
          <div style={{ maxWidth: 520 }}>
            <div style={{ width: 40, height: 3, background: "var(--primary)", marginBottom: 32 }} />
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 20px 0" }}>
              The Craft
            </p>
            <blockquote
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: "var(--text)",
                margin: "0 0 28px 0",
              }}
            >
              Every Stripe. Every Bolt. Every Detail.
            </blockquote>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", margin: "0 0 32px 0" }}>
              We don't sell toys. We sell obsession — condensed into palm-sized precision. Each model in our catalog is a licensed replica: die-cast metal body, hand-painted livery, and opening components that make a collector's hands itch the moment the box opens.
            </p>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "transparent",
                color: "var(--text)",
                border: "1px solid var(--muted)",
                borderRadius: "var(--radius-md)",
                padding: "14px 32px",
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
            >
              Explore the Catalog
            </button>
          </div>
        </div>
      </section>

      {/* ═══ TRUST STRIP — 3-column flat ═══ */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "72px clamp(24px, 5vw, 80px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 48,
          }}
        >
          {[
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ),
              stat: "500+",
              label: "Official Licensed Models",
              desc: "Every model in our catalog carries manufacturer authorization.",
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <line x1="12" y1="12" x2="12" y2="16" />
                  <line x1="10" y1="14" x2="14" y2="14" />
                </svg>
              ),
              stat: "1:18–1:64",
              label: "Precision Die-Cast Metal",
              desc: "Zinc alloy bodies, rubber tires, opening doors — collector standard.",
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ),
              stat: "Pan-India",
              label: "Nationwide Shipping",
              desc: "Free delivery above ₹999. Orders dispatched within 24 hours.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div style={{ color: "var(--accent)" }}>{item.icon}</div>
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 900, color: "var(--accent)", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                  {item.stat}
                </p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", lineHeight: 1.65, color: "var(--muted)", margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA FINALE — Full-bleed charcoal with product ═══ */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          padding: "var(--space-section) clamp(24px, 5vw, 80px)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 16px 0" }}>
            Start Today
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              color: "var(--text)",
              margin: "0 0 32px 0",
            }}
          >
            Build Your
            <br />
            <span style={{ color: "var(--accent)" }}>Collection</span>
          </h2>

          <img
            src="/product-1.jpg"
            alt="Chevrolet Camaro die-cast model hero shot"
            style={{
              width: "clamp(280px, 60vw, 600px)",
              objectFit: "contain",
              display: "block",
              margin: "0 auto 40px",
              filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.8))",
            }}
          />

          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.1rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "20px 56px",
              cursor: "pointer",
              transition: "transform 0.15s ease",
              display: "inline-block",
            }}
          >
            Shop the Collection
          </button>
        </div>
      </section>

      {/* ═══ NEWSLETTER — Join the Collector's Circle ═══ */}
      <section
        id="contact"
        className="reveal"
        style={{
          background: "var(--accent)",
          padding: "72px clamp(24px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "#000",
              margin: "0 0 12px 0",
            }}
          >
            Join the Collector's Circle
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#333", lineHeight: 1.65, margin: "0 0 32px 0" }}>
            New models, exclusive drops, and collector intel — direct to your inbox.
          </p>
          {subscribed ? (
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 700, color: "#000", textTransform: "uppercase" }}>
              ✓ You're in. Welcome to the circle.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  height: 52,
                  padding: "0 20px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  outline: "none",
                  background: "#fff",
                  color: "#333",
                  width: "clamp(200px, 50vw, 320px)",
                  flexShrink: 1,
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />
              <button
                onClick={handleSubscribe}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  height: 52,
                  padding: "0 28px",
                  background: "var(--bg)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}