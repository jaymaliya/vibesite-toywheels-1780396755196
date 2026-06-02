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
  { id: 4, img: "/product-4.jpg", name: "Welly Lamborghini Aventador LP 700-4 1:24 Die-Cast Model Car", description: "Highly detailed metallic papaya orange Lamborghini Aventador LP 700-4 die-cast model.", price: 599, badge: "" },
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

const features = [
  {
    num: "01",
    title: "Die-Cast Precision",
    body: "Every model cast from zinc alloy — the same material used in full-scale automotive prototyping. Weight and balance match the real thing.",
  },
  {
    num: "02",
    title: "Licensed Originals",
    body: "Official manufacturer licensing means every badge, stripe, and door stamp is factory-accurate. No approximations.",
  },
  {
    num: "03",
    title: "Collector Graded",
    body: "Individually inspected, wrapped, and boxed. Your model arrives shelf-ready, display-worthy, and investment-grade.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem, totalItems } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string | number, boolean>>({});
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleAddToCart = (p: (typeof products)[0]) => {
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
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-body)",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      {/* Global styles injected once — keyframes only, no layout */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
            :root {
              --font-heading: 'Clash Display', sans-serif;
              --font-body: 'DM Serif Display', serif;
              --bg: #FAF7F2;
              --surface: #C4181F;
              --primary: #E61F27;
              --accent: #F7E01E;
              --text: #1A1A1A;
              --muted: #D4858A;
              --radius-sm: 2px;
              --radius-md: 6px;
              --radius-lg: 12px;
              --radius-pill: 999px;
              --shadow-xs: 0 1px 4px rgba(230,31,39,0.08);
              --shadow-sm: 0 2px 10px rgba(230,31,39,0.12);
              --shadow-md: 0 4px 20px rgba(230,31,39,0.15);
              --shadow-lg: 0 8px 36px rgba(230,31,39,0.18);
              --shadow-xl: 0 16px 56px rgba(230,31,39,0.22);
              --glow: 0 0 48px rgba(247,224,30,0.35);
              --gradient-hero: linear-gradient(to right, #0D0D0D 0%, transparent 25%);
              --gradient-subtle: linear-gradient(135deg, #FAF7F2 0%, #F0EDE7 100%);
              --space-section: 96px;
              --space-card: 24px;
              --transition-smooth: 300ms cubic-bezier(0.4,0,0.2,1);
            }
            *, *::before, *::after { box-sizing: border-box; }
            body { margin: 0; }
            a { text-decoration: none; color: inherit; }
            button:focus-visible, a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
            .will-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.25,0.1,0.25,1), transform 0.65s cubic-bezier(0.25,0.1,0.25,1); }
            .visible { opacity: 1 !important; transform: translateY(0) !important; }
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .marquee-track { display: flex; animation: marquee 26s linear infinite; width: max-content; }
            .marquee-track:hover { animation-play-state: paused; }
            .rail-scroll { display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 8px; scrollbar-width: none; -ms-overflow-style: none; }
            .rail-scroll::-webkit-scrollbar { display: none; }
            @keyframes pulse-dot { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
          `,
        }}
      />

      <Navbar />

      {/* ════════════════════════════════════════════════
          HERO — SPLIT TEXT LEFT, hard 42/58 edge
      ════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "42fr 58fr",
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        {/* LEFT PANEL — #0D0D0D dark */}
        <div
          style={{
            position: "relative",
            background: "#0D0D0D",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: isMobile ? "48px 24px 56px 24px" : "0 48px 72px 56px",
            minHeight: isMobile ? "auto" : "100vh",
            zIndex: 2,
          }}
        >
          {/* 4px yellow vertical rule at right edge of left panel */}
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 4,
                height: "100%",
                background: "var(--accent)",
                zIndex: 10,
              }}
            />
          )}

          {/* Badge tags — filled yellow/black */}
          <div style={{ marginBottom: 28, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["1:24 SCALE", "LICENSED MODEL", "DIE-CAST METAL"].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "var(--accent)",
                  color: "#0D0D0D",
                  padding: "4px 10px",
                  borderRadius: 2,
                  border: "none",
                  display: "inline-block",
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Headline — alternating color lines */}
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              margin: "0 0 24px 0",
              color: "#FFFFFF",
            }}
          >
            <span style={{ color: "#FFFFFF", display: "block" }}>OWN THE</span>
            <span style={{ color: "var(--accent)", display: "block" }}>ROAD.</span>
            <span style={{ color: "#FFFFFF", display: "block" }}>OWN THE</span>
            <span style={{ color: "var(--accent)", display: "block" }}>LEGEND.</span>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "#9A9A9A",
              margin: "0 0 36px 0",
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
              color: "#0D0D0D",
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

          {/* Trust micro-copy */}
          <p
            style={{
              marginTop: 20,
              fontSize: "0.8rem",
              color: "#6A6A6A",
              fontFamily: "var(--font-body)",
              lineHeight: 1.5,
            }}
          >
            ★★★★★ Trusted by 10,000+ collectors · Free shipping above ₹999
          </p>
        </div>

        {/* RIGHT PANEL — full-bleed product photo */}
        {!isMobile && (
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              background: "#0D0D0D",
              minHeight: "100vh",
            }}
          >
            <img
              src="/product-1.jpg"
              alt="Maisto Chevrolet Camaro SS RS 1:24 Die-Cast — lemon yellow with twin black racing stripes at a dynamic angle"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
            {/* Feather gradient at left join edge */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "22%",
                height: "100%",
                background: "linear-gradient(to right, #0D0D0D 0%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />
          </div>
        )}

        {/* Mobile: show product image above fold */}
        {isMobile && (
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              background: "#0D0D0D",
              height: "55vw",
              maxHeight: 320,
              order: -1,
            }}
          >
            <img
              src="/product-1.jpg"
              alt="Maisto Chevrolet Camaro SS RS 1:24 Die-Cast model"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40%",
                background: "linear-gradient(to top, #0D0D0D 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════
          TRUST TICKER — yellow band, dark text
      ════════════════════════════════════════════════ */}
      <div
        style={{
          background: "var(--accent)",
          overflow: "hidden",
          padding: "14px 0",
          borderTop: "3px solid #0D0D0D",
          borderBottom: "3px solid #0D0D0D",
        }}
      >
        <div className="marquee-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.82rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#0D0D0D",
                padding: "0 36px",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {item}
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#0D0D0D",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          CROWD FAVOURITES — horizontal scroll rail
      ════════════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "#F5F5F5",
          padding: "80px 0 80px 0",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px)" }}>
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 40,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--primary)",
                  marginBottom: 10,
                  margin: "0 0 10px 0",
                }}
              >
                Crowd Favourites
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Most Collected
              </h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
                color: "var(--text)",
                border: "2px solid var(--text)",
                borderRadius: "var(--radius-md)",
                padding: "12px 28px",
                cursor: "pointer",
                transition: "transform 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              View All Models
            </button>
          </div>

          {/* Horizontal rail */}
          <div className="rail-scroll" ref={railRef}>
            {products.map((p) => (
              <article
                key={p.id}
                style={{
                  flex: "0 0 auto",
                  width: "clamp(240px, 28vw, 300px)",
                  scrollSnapAlign: "start",
                  background: "#FFFFFF",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: "0 2px 12px rgba(26,26,26,0.08)",
                }}
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                  )
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 16px 40px rgba(26,26,26,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,26,26,0.08)";
                }}
              >
                {/* Image area */}
                <div style={{ overflow: "hidden", background: "#F8F8F8", aspectRatio: "1/1", position: "relative" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                      transition: "transform 0.6s ease",
                      padding: "12px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  {p.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        background: "var(--accent)",
                        color: "#0D0D0D",
                        padding: "3px 8px",
                        borderRadius: 2,
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
                {/* Info below */}
                <div style={{ padding: "16px 16px 20px 16px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "var(--text)",
                      margin: "0 0 8px 0",
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "var(--primary)",
                      }}
                    >
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      onMouseEnter={(ev) => (ev.currentTarget.style.transform = "scale(1.04)")}
                      onMouseLeave={(ev) => (ev.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={(ev) => (ev.currentTarget.style.transform = "scale(0.97)")}
                      onMouseUp={(ev) => (ev.currentTarget.style.transform = "scale(1.04)")}
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        background: addedIds[p.id] ? "#1A1A1A" : "var(--accent)",
                        color: addedIds[p.id] ? "#FFFFFF" : "#0D0D0D",
                        border: "none",
                        borderRadius: "var(--radius-md)",
                        padding: "8px 14px",
                        cursor: "pointer",
                        transition: "transform 0.15s ease, background 0.2s ease, color 0.2s ease",
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
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FEATURE TRIO — 3-col asymmetric on dark
      ════════════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "#0D0D0D",
          padding: "var(--space-section) clamp(24px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Section label */}
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 56,
            }}
          >
            Why Collectors Choose Us
          </p>

          {/* Asymmetric 3-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr 1fr",
              gap: 2,
              alignItems: "stretch",
            }}
          >
            {features.map((f, i) => (
              <div
                key={f.num}
                style={{
                  background: i === 0 ? "#161616" : i === 1 ? "#111111" : "#0A0A0A",
                  padding: "48px clamp(24px, 4vw, 48px)",
                  borderLeft: i > 0 ? "1px solid #2A2A2A" : "none",
                  borderTop: isMobile && i > 0 ? "1px solid #2A2A2A" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "3.5rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    lineHeight: 1,
                    marginBottom: 24,
                    opacity: 0.5,
                  }}
                >
                  {f.num}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    color: "#FFFFFF",
                    margin: "0 0 20px 0",
                    lineHeight: 1.1,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    color: "#7A7A7A",
                    margin: 0,
                  }}
                >
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          BRAND MANIFESTO — full-bleed yellow band
      ════════════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "var(--accent)",
          padding: "var(--space-section) clamp(24px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#0D0D0D",
              opacity: 0.55,
              marginBottom: 32,
            }}
          >
            The Toywheels Standard
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: "#0D0D0D",
              margin: "0 0 48px 0",
              maxWidth: 900,
            }}
          >
            Real cars shrunk to 1:24th scale. Every bolt accurate. Every badge licensed. Every collector satisfied — or your money back.
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "center",
            }}
          >
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
                background: "#0D0D0D",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "var(--radius-md)",
                padding: "18px 40px",
                cursor: "pointer",
                transition: "transform 0.15s ease",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              Explore the Catalogue
            </button>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                color: "#0D0D0D",
                opacity: 0.7,
              }}
            >
              500+ models in stock · Ships within 48 hours · COD available
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FEATURED PRODUCT — Asymmetric split
      ════════════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "#FAF7F2",
          padding: "var(--space-section) clamp(24px, 5vw, 80px)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "60fr 40fr",
            gap: "clamp(40px, 6vw, 80px)",
            alignItems: "center",
          }}
        >
          {/* Image side */}
          <div
            style={{
              overflow: "hidden",
              borderRadius: "var(--radius-lg)",
              background: "#F0EDE7",
              cursor: "pointer",
              aspectRatio: "4/3",
            }}
            onClick={() =>
              router.push(
                `/product?name=${encodeURIComponent(products[3].name)}&price=${products[3].price}&img=${encodeURIComponent(products[3].img)}`
              )
            }
          >
            <img
              src={products[3].img}
              alt={products[3].name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
                padding: "32px",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Text side */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--primary)",
                marginBottom: 16,
              }}
            >
              Collector's Pick
            </p>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: "var(--text)",
                margin: "0 0 20px 0",
              }}
            >
              Lamborghini Aventador LP 700-4
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "#555",
                margin: "0 0 32px 0",
              }}
            >
              {products[3].description} Welly's 1:24 precision casting means every vent, every crease, every carbon-fibre detail is factory-accurate. Display it. Obsess over it.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                ₹{products[3].price.toLocaleString("en-IN")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "#888",
                }}
              >
                Free shipping · COD available
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => handleAddToCart(products[3])}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: addedIds[products[3].id] ? "var(--text)" : "var(--accent)",
                  color: addedIds[products[3].id] ? "#FFF" : "#0D0D0D",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 32px",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, background 0.2s ease, color 0.2s ease",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                {addedIds[products[3].id] ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(products[3].name)}&price=${products[3].price}&img=${encodeURIComponent(products[3].img)}`
                  )
                }
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: "transparent",
                  color: "var(--text)",
                  border: "2px solid var(--text)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 32px",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          NEWSLETTER — dark band
      ════════════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "#0D0D0D",
          padding: "var(--space-section) clamp(24px, 5vw, 80px)",
        }}
      >
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 16,
            }}
          >
            New Arrivals · Restocks · Collector Drops
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: "#FFFFFF",
              margin: "0 0 16px 0",
            }}
          >
            Stay Ahead of the Drop
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "#7A7A7A",
              margin: "0 0 40px 0",
            }}
          >
            Get first access to limited editions, restock alerts, and exclusive collector discounts — straight to your inbox.
          </p>

          {subscribed ? (
            <div
              style={{
                background: "#161616",
                border: "1px solid var(--accent)",
                borderRadius: "var(--radius-lg)",
                padding: "24px 32px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                You're in the garage. ✓
              </p>
              <p style={{ fontFamily: "var(--font-body)", color: "#7A7A7A", marginTop: 8, fontSize: "0.9rem" }}>
                We'll ping you when the next drop lands.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 0,
                maxWidth: 520,
                margin: "0 auto",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                boxShadow: "0 0 0 2px var(--accent)",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  padding: "18px 20px",
                  background: "#161616",
                  border: "none",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  outline: "none",
                  minWidth: 0,
                }}
              />
              <button
                onClick={handleSubscribe}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: "var(--accent)",
                  color: "#0D0D0D",
                  border: "none",
                  padding: "18px 28px",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Subscribe
              </button>
            </div>
          )}

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              color: "#4A4A4A",
              marginTop: 16,
            }}
          >
            No spam. Unsubscribe anytime. Collector-to-collector, always.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}