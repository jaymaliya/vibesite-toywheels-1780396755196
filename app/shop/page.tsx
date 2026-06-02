"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
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

const filterBrands = ["All", "Maisto", "Centy", "Welly"];
const filterScales = ["All", "1:24", "1:36"];

type Product = typeof products[0];

export default function ShopPage() {
  const router = useRouter();
  const { addItem, totalItems } = useCart() ?? { addItem: () => {}, totalItems: 0 };

  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedScale, setSelectedScale] = useState("All");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

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

  const filteredProducts = products.filter((p) => {
    const brandMatch = selectedBrand === "All" || p.brand === selectedBrand;
    const scaleMatch = selectedScale === "All" || p.scale === selectedScale;
    return brandMatch && scaleMatch;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

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

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        :root {
          --font-heading: 'Barlow Condensed', sans-serif;
          --font-body: 'DM Sans', sans-serif;
          --bg: #1A1A1A;
          --surface: #242424;
          --primary: #E61F27;
          --accent: #F7E01E;
          --text: #F2F2F2;
          --muted: #7A7A7A;
          --radius-sm: 4px;
          --radius-md: 8px;
          --radius-lg: 16px;
          --radius-pill: 999px;
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.25);
          --shadow-md: 0 4px 20px rgba(0,0,0,0.35);
          --shadow-lg: 0 8px 32px rgba(0,0,0,0.45);
          --shadow-xl: 0 16px 48px rgba(0,0,0,0.55);
          --space-section: 80px;
          --transition-smooth: 0.3s cubic-bezier(0.4,0,0.2,1);
          --gradient-hero: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
        }
        .will-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.25,0.1,0.25,1), transform 0.65s cubic-bezier(0.25,0.1,0.25,1); }
        .visible { opacity: 1 !important; transform: none !important; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-track { display: flex; width: max-content; animation: ticker 28s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
        .product-card-img { transition: transform 0.6s ease; width: 100%; aspect-ratio: 1/1; object-fit: cover; }
        .product-card-img:hover { transform: scale(1.05); }
        .quick-view-btn { position: absolute; bottom: 0; left: 0; right: 0; height: 44px; background: rgba(26,26,26,0.88); color: #F2F2F2; font-family: var(--font-body); font-size: 13px; font-weight: 600; letter-spacing: 0.06em; border: none; cursor: pointer; opacity: 0; transition: opacity 0.22s ease; display: flex; align-items: center; justify-content: center; }
        .product-card:hover .quick-view-btn { opacity: 1; }
        .filter-chip { background: var(--surface); color: var(--muted); border: 1px solid #333; border-radius: var(--radius-sm); padding: 6px 14px; font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s ease; }
        .filter-chip:hover { border-color: var(--accent); color: var(--accent); }
        .filter-chip.active { background: var(--accent); color: #1A1A1A; border-color: var(--accent); font-weight: 700; }
        .bento-tile { border-radius: var(--radius-md); overflow: hidden; }
        @keyframes fadeScaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .modal-enter { animation: fadeScaleIn 0.22s ease-out forwards; }
        input:focus { outline: 2px solid var(--accent); outline-offset: 2px; }
        button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        @media (max-width: 767px) {
          :root { --space-section: 48px; }
        }
      `}</style>

      <Navbar />

      {/* ── SHOP BANNER HERO ── */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "52vh",
          background: "var(--surface)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          marginTop: "0",
        }}
      >
        {/* Diagonal accent stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "55%",
            width: "18%",
            height: "100%",
            background: "var(--accent)",
            transform: "skewX(-8deg)",
            zIndex: 1,
            opacity: 0.08,
          }}
        />
        {/* Left text panel */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "64px 48px",
            maxWidth: "600px",
            flex: "0 0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "16px",
            }}
          >
            THE FULL CATALOGUE
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3rem,7vw,5.5rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              color: "var(--text)",
              marginBottom: "20px",
            }}
          >
            EVERY
            <br />
            <span style={{ color: "var(--accent)" }}>MODEL.</span>
            <br />
            EVERY
            <br />
            DETAIL.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "var(--muted)",
              lineHeight: 1.7,
              maxWidth: "380px",
              marginBottom: "28px",
            }}
          >
            Precision die-cast replicas for collectors who live the legend. Licensed, detailed, built to last.
          </p>
          {/* Trust row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              fontSize: "12px",
              color: "var(--muted)",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.04em",
            }}
          >
            <span>⭐ 4.8 · 10,000+ Collectors</span>
            <span>🚚 Free Shipping ₹999+</span>
            <span>🏷 Official Licensed Models</span>
          </div>
        </div>
        {/* Right product image */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "45%",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <img
            src="/product-1.jpg"
            alt="Featured Maisto Chevrolet Camaro Die-Cast Model"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(0.85)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, var(--surface) 0%, transparent 40%)",
            }}
          />
        </div>
      </section>

      {/* ── MARQUEE TICKER ── */}
      <div
        style={{
          background: "var(--accent)",
          overflow: "hidden",
          padding: "12px 0",
          borderTop: "2px solid #e0cc00",
          borderBottom: "2px solid #e0cc00",
        }}
      >
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--bg)",
                padding: "0 28px",
                display: "inline-flex",
                alignItems: "center",
                gap: "28px",
                whiteSpace: "nowrap",
              }}
            >
              {item}
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--bg)", display: "inline-block", opacity: 0.4 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN SHOP LAYOUT: FILTERS + GRID ── */}
      <section
        className="reveal"
        style={{
          maxWidth: "1380px",
          margin: "0 auto",
          padding: "56px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "40px",
        }}
      >
        {/* Filter + Grid in a responsive flex layout */}
        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
          {/* ── SIDEBAR FILTERS (desktop) ── */}
          <aside
            style={{
              flex: "0 0 220px",
              display: "block",
            }}
            className="hidden-mobile-filters"
          >
            <div
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-md)",
                padding: "28px",
                position: "sticky",
                top: "96px",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "16px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--text)",
                  marginBottom: "24px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #333",
                }}
              >
                FILTERS
              </h3>

              {/* Brand filter */}
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "12px",
                  }}
                >
                  BRAND
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {filterBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`filter-chip${selectedBrand === brand ? " active" : ""}`}
                      style={{ textAlign: "left" }}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale filter */}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "12px",
                  }}
                >
                  SCALE
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {filterScales.map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setSelectedScale(scale)}
                      className={`filter-chip${selectedScale === scale ? " active" : ""}`}
                      style={{ textAlign: "left" }}
                    >
                      {scale}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── PRODUCT GRID ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Mobile filter bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "var(--muted)",
                }}
              >
                {filteredProducts.length} model{filteredProducts.length !== 1 ? "s" : ""} found
              </p>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                style={{
                  background: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid #333",
                  borderRadius: "var(--radius-pill)",
                  padding: "10px 20px",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  minHeight: "44px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                FILTER
              </button>
            </div>

            {/* Mobile active filter pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
              {selectedBrand !== "All" && (
                <span
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg)",
                    borderRadius: "var(--radius-pill)",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedBrand("All")}
                >
                  {selectedBrand}
                  <span style={{ fontWeight: 900 }}>×</span>
                </span>
              )}
              {selectedScale !== "All" && (
                <span
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg)",
                    borderRadius: "var(--radius-pill)",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedScale("All")}
                >
                  {selectedScale}
                  <span style={{ fontWeight: 900 }}>×</span>
                </span>
              )}
            </div>

            {/* Products grid */}
            {visibleProducts.length === 0 ? (
              <div
                style={{
                  padding: "80px 40px",
                  textAlign: "center",
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                }}
              >
                <p>No models match your filters.</p>
                <button
                  onClick={() => { setSelectedBrand("All"); setSelectedScale("All"); }}
                  style={{
                    marginTop: "16px",
                    background: "var(--accent)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 28px",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                  gap: "24px",
                }}
              >
                {visibleProducts.map((p, idx) => (
                  <article
                    key={p.id}
                    className="product-card"
                    style={{
                      background: "var(--surface)",
                      borderRadius: "var(--radius-md)",
                      overflow: "visible",
                      cursor: "pointer",
                      boxShadow: "var(--shadow-sm)",
                      transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                      position: "relative",
                      animationDelay: `${idx * 80}ms`,
                    }}
                    onClick={() =>
                      router.push(
                        `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                      )
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    }}
                  >
                    {/* Product Image */}
                    <div
                      style={{
                        overflow: "hidden",
                        borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                        position: "relative",
                        background: "#fff",
                      }}
                    >
                      <img
                        src={p.img}
                        alt={p.name}
                        className="product-card-img"
                      />
                      {/* Badge */}
                      {p.badge && (
                        <span
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            background: p.badge === "HOT" ? "var(--primary)" : "var(--accent)",
                            color: p.badge === "HOT" ? "#fff" : "var(--bg)",
                            fontFamily: "var(--font-heading)",
                            fontSize: "10px",
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "3px 10px",
                            borderRadius: "var(--radius-sm)",
                            zIndex: 2,
                          }}
                        >
                          {p.badge}
                        </span>
                      )}
                      {/* Quick View overlay */}
                      <button
                        className="quick-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickView(p);
                        }}
                      >
                        QUICK VIEW
                      </button>
                    </div>

                    {/* Card info */}
                    <div style={{ padding: "16px" }}>
                      <p
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                          marginBottom: "6px",
                        }}
                      >
                        {p.brand} · {p.scale} SCALE
                      </p>
                      <h3
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "17px",
                          fontWeight: 700,
                          color: "var(--text)",
                          lineHeight: 1.2,
                          textTransform: "uppercase",
                          letterSpacing: "-0.01em",
                          marginBottom: "6px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.name}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "12px",
                          color: "var(--muted)",
                          lineHeight: 1.5,
                          marginBottom: "14px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.description}
                      </p>

                      {/* Price + Actions */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "var(--accent)",
                          }}
                        >
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={(e) => handleAddToCart(p, e)}
                          style={{
                            background: addedIds[p.id] ? "var(--primary)" : "var(--accent)",
                            color: addedIds[p.id] ? "#fff" : "var(--bg)",
                            border: "none",
                            borderRadius: "var(--radius-sm)",
                            padding: "8px 14px",
                            fontFamily: "var(--font-body)",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            minHeight: "36px",
                            whiteSpace: "nowrap",
                            transition: "background 0.18s ease, color 0.18s ease, transform 0.15s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                        >
                          {addedIds[p.id] ? "Added ✓" : "Add to Cart"}
                        </button>
                      </div>

                      {/* View Product */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                          );
                        }}
                        style={{
                          marginTop: "10px",
                          width: "100%",
                          background: "transparent",
                          color: "var(--text)",
                          border: "1px solid #333",
                          borderRadius: "var(--radius-sm)",
                          padding: "8px",
                          fontFamily: "var(--font-body)",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          letterSpacing: "0.04em",
                          transition: "border-color 0.18s ease, color 0.18s ease",
                          minHeight: "36px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--accent)";
                          e.currentTarget.style.color = "var(--accent)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#333";
                          e.currentTarget.style.color = "var(--text)";
                        }}
                      >
                        View Product
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Load More */}
            {visibleCount < filteredProducts.length && (
              <div style={{ textAlign: "center", marginTop: "48px" }}>
                <button
                  onClick={() => setVisibleCount((v) => v + 4)}
                  style={{
                    background: "transparent",
                    color: "var(--text)",
                    border: "2px solid var(--accent)",
                    borderRadius: "var(--radius-sm)",
                    padding: "14px 48px",
                    fontFamily: "var(--font-heading)",
                    fontSize: "16px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    transition: "background 0.18s ease, color 0.18s ease",
                    minHeight: "52px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent)";
                    e.currentTarget.style.color = "var(--bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text)";
                  }}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── BENTO MOSAIC SHOWCASE ── */}
      <section
        className="reveal"
        style={{
          maxWidth: "1380px",
          margin: "0 auto",
          padding: "0 24px var(--space-section)",
        }}
      >
        <div style={{ marginBottom: "40px" }}>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "10px",
            }}
          >
            COLLECTOR GRADE DETAIL
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem,5vw,3.5rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              color: "var(--text)",
            }}
          >
            BUILT TO IMPRESS.
            <br />
            <span style={{ color: "var(--muted)" }}>MADE TO COLLECT.</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gridAutoRows: "220px",
            gap: "16px",
          }}
        >
          {/* Large tile: product feature */}
          <div
            className="bento-tile"
            style={{
              gridColumn: "span 2",
              gridRow: "span 2",
              background: "var(--surface)",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={() => router.push("/shop")}
          >
            <img
              src="/product-4.jpg"
              alt="Lamborghini Aventador Die-Cast Detail"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)",
              }}
            />
            <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "6px",
                }}
              >
                FEATURED MODEL
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "22px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                LAMBORGHINI
                <br />
                AVENTADOR LP 700-4
              </h3>
            </div>
          </div>

          {/* Stat tile */}
          <div
            className="bento-tile"
            style={{
              background: "var(--accent)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "56px",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "var(--bg)",
                lineHeight: 1,
              }}
            >
              500+
            </span>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--bg)",
                marginTop: "8px",
              }}
            >
              MODELS IN STOCK
            </p>
          </div>

          {/* Product 2 tile */}
          <div
            className="bento-tile"
            style={{
              background: "var(--surface)",
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
            }}
            onClick={() =>
              router.push(
                `/product?name=${encodeURIComponent(products[1].name)}&price=${products[1].price}&img=${encodeURIComponent(products[1].img)}`
              )
            }
          >
            <img
              src="/product-2.jpg"
              alt="Centy Toys Mahindra Thar Die-Cast Model"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)",
              }}
            />
            <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px" }}>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.01em",
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                MAHINDRA THAR
              </p>
              <p style={{ color: "var(--accent)", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "14px", marginTop: "4px" }}>
                ₹{products[1].price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Spec tile */}
          <div
            className="bento-tile"
            style={{
              background: "var(--primary)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              WHY COLLECTORS CHOOSE US
            </p>
            <div>
              {["Die-cast metal body", "Licensed reproductions", "Hand-painted detail", "Opening doors & hood"].map((spec) => (
                <div
                  key={spec}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      color: "#fff",
                      lineHeight: 1.4,
                    }}
                  >
                    {spec}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product 3 tile */}
          <div
            className="bento-tile"
            style={{
              background: "var(--surface)",
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
            }}
            onClick={() =>
              router.push(
                `/product?name=${encodeURIComponent(products[2].name)}&price=${products[2].price}&img=${encodeURIComponent(products[2].img)}`
              )
            }
          >
            <img
              src="/product-3.jpg"
              alt="Centy Toys Tata Nexon Die-Cast Model"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)",
              }}
            />
            <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px" }}>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.01em",
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                TATA NEXON
              </p>
              <p style={{ color: "var(--accent)", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "14px", marginTop: "4px" }}>
                ₹{products[2].price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL ASYMMETRIC SPLIT ── */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          padding: "var(--space-section) 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1380px",
            margin: "0 auto",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "56px",
            alignItems: "center",
          }}
        >
          {/* Image */}
          <div
            style={{
              overflow: "hidden",
              borderRadius: "var(--radius-md)",
              position: "relative",
            }}
          >
            <img
              src="/product-1.jpg"
              alt="Chevrolet Camaro SS RS Die-Cast Model — collector grade"
              style={{
                width: "100%",
                aspectRatio: "4/3",
                objectFit: "cover",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Text */}
          <div style={{ padding: "8px 0" }}>
            <div
              style={{
                width: "40px",
                height: "3px",
                background: "var(--primary)",
                marginBottom: "24px",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "14px",
              }}
            >
              THE CRAFT
            </p>
            <blockquote
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem,4vw,2.8rem)",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                lineHeight: 1.0,
                color: "var(--text)",
                margin: "0 0 24px",
                borderLeft: "none",
                padding: 0,
              }}
            >
              EVERY STRIPE.
              <br />
              EVERY BOLT.
              <br />
              <span style={{ color: "var(--accent)" }}>EVERY DETAIL.</span>
            </blockquote>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                color: "var(--muted)",
                lineHeight: 1.75,
                marginBottom: "32px",
                maxWidth: "420px",
              }}
            >
              We source only officially licensed die-cast models from the world&apos;s most respected manufacturers.
              Each piece is precision engineered, hand-painted, and quality-checked — collector grade from the factory floor to your display shelf.
            </p>
            <button
              onClick={() => router.push("/shop")}
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "14px 36px",
                fontFamily: "var(--font-heading)",
                fontSize: "15px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                minHeight: "52px",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section
        className="reveal"
        style={{
          background: "var(--bg)",
          padding: "56px 24px",
          borderTop: "1px solid #2a2a2a",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "40px",
            textAlign: "center",
          }}
        >
          {[
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ),
              stat: "10,000+",
              label: "Collectors Worldwide",
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h3l3 3v5h-6V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              ),
              stat: "FREE",
              label: "Shipping Above ₹999",
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
              ),
              stat: "100%",
              label: "Official Licensed Models",
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              stat: "2 YEAR",
              label: "Collector's Warranty",
            },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{ color: "var(--accent)" }}>{item.icon}</div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "28px",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                }}
              >
                {item.stat}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "var(--muted)",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section
        className="reveal"
        style={{
          background: "var(--accent)",
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(26,26,26,0.6)",
            marginBottom: "12px",
          }}
        >
          JOIN THE COLLECTOR'S CIRCLE
        </p>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem,5vw,3.5rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
            color: "var(--bg)",
            marginBottom: "14px",
          }}
        >
          NEW ARRIVALS.
          <br />
          BEFORE ANYONE ELSE.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            color: "rgba(26,26,26,0.7)",
            lineHeight: 1.6,
            maxWidth: "440px",
            margin: "0 auto 32px",
          }}
        >
          Get first access to new models, limited editions, and exclusive collector deals. No spam — just the good stuff.
        </p>

        {subscribed ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "var(--bg)",
              color: "var(--accent)",
              borderRadius: "var(--radius-sm)",
              padding: "16px 32px",
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            YOU'RE IN THE CIRCLE
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: "1 1 260px",
                height: "52px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                padding: "0 18px",
                fontSize: "15px",
                fontFamily: "var(--font-body)",
                color: "var(--bg)",
                background: "#fff",
                minWidth: "200px",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
            />
            <button
              onClick={handleSubscribe}
              style={{
                height: "52px",
                padding: "0 32px",
                background: "var(--bg)",
                color: "var(--accent)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-heading)",
                fontSize: "15px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "transform 0.15s ease",
                whiteSpace: "nowrap",
                minHeight: "52px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Subscribe
            </button>
          </div>
        )}
      </section>

      <Footer />

      {/* ── QUICK VIEW MODAL ── */}
      {quickView && (
        <div
          onClick={() => setQuickView(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.78)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="modal-enter"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-md)",
              width: "100%",
              maxWidth: "680px",
              overflow: "hidden",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              }}
            >
              {/* Image */}
              <div style={{ background: "#fff", overflow: "hidden" }}>
                <img
                  src={quickView.img}
                  alt={quickView.name}
                  style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
                />
              </div>

              {/* Info */}
              <div style={{ padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--muted)",
                      }}
                    >
                      {quickView.brand} · {quickView.scale} SCALE
                    </p>
                    <button
                      onClick={() => setQuickView(null)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--muted)",
                        cursor: "pointer",
                        padding: "4px",
                        minHeight: "28px",
                        minWidth: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "20px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "-0.01em",
                      color: "var(--text)",
                      lineHeight: 1.15,
                      marginBottom: "10px",
                    }}
                  >
                    {quickView.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      color: "var(--muted)",
                      lineHeight: 1.65,
                      marginBottom: "20px",
                    }}
                  >
                    {quickView.description}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "26px",
                      fontWeight: 700,
                      color: "var(--accent)",
                      display: "block",
                      marginBottom: "20px",
                    }}
                  >
                    ₹{quickView.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button
                    onClick={() => {
                      handleAddToCart(quickView);
                    }}
                    style={{
                      background: "var(--accent)",
                      color: "var(--bg)",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      padding: "14px",
                      fontFamily: "var(--font-heading)",
                      fontSize: "15px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      minHeight: "50px",
                      transition: "transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {addedIds[quickView.id] ? "Added ✓" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => {
                      setQuickView(null);
                      router.push(
                        `/product?name=${encodeURIComponent(quickView.name)}&price=${quickView.price}&img=${encodeURIComponent(quickView.img)}`
                      );
                    }}
                    style={{
                      background: "transparent",
                      color: "var(--text)",
                      border: "1px solid #333",
                      borderRadius: "var(--radius-sm)",
                      padding: "12px",
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      letterSpacing: "0.04em",
                      minHeight: "46px",
                      transition: "border-color 0.18s ease, color 0.18s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#333";
                      e.currentTarget.style.color = "var(--text)";
                    }}
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE FILTER OVERLAY ── */}
      {mobileFiltersOpen && (
        <div
          onClick={() => setMobileFiltersOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 90,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            className="modal-enter"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              borderRadius: "16px 16px 0 0",
              padding: "28px 24px 40px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "20px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text)",
                }}
              >
                FILTERS
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  padding: "8px",
                  minHeight: "44px",
                  minWidth: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "12px",
                }}
              >
                BRAND
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {filterBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`filter-chip${selectedBrand === brand ? " active" : ""}`}
                    style={{ minHeight: "44px", padding: "10px 18px" }}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "12px",
                }}
              >
                SCALE
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {filterScales.map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setSelectedScale(scale)}
                    className={`filter-chip${selectedScale === scale ? " active" : ""}`}
                    style={{ minHeight: "44px", padding: "10px 18px" }}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              style={{
                width: "100%",
                height: "52px",
                background: "var(--accent)",
                color: "var(--bg)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-heading)",
                fontSize: "16px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              APPLY FILTERS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}