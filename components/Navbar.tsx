"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [prevTotal, setPrevTotal] = React.useState(totalItems);
  const [badgePulse, setBadgePulse] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (totalItems !== prevTotal) {
      setBadgePulse(true);
      setPrevTotal(totalItems);
      const t = setTimeout(() => setBadgePulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [totalItems, prevTotal]);

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function scrollToSection(id: string) {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  const leftLinks = [
    { label: "Models", action: () => { setMobileOpen(false); router.push("/shop"); } },
    { label: "New Arrivals", action: () => { setMobileOpen(false); router.push("/shop"); } },
    { label: "Brands", action: () => { setMobileOpen(false); router.push("/shop"); } },
  ];

  const rightLinks = [
    { label: "About", action: () => scrollToSection("about") },
    { label: "Contact", action: () => scrollToSection("about") },
    { label: "Account", action: () => { setMobileOpen(false); router.push("/shop"); } },
  ];

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: "80px",
          background: "var(--bg)",
          borderBottom: scrolled ? "1px solid #2e2e2e" : "1px solid transparent",
          boxShadow: scrolled
            ? "0 4px 24px 0 rgba(0,0,0,0.45)"
            : "none",
          transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1)",
          fontFamily: "var(--font-body)",
        }}
      >
        <nav
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
          }}
          aria-label="Main navigation"
        >
          {/* Left links — desktop */}
          <div
            className="hidden md:flex"
            style={{ gap: "32px", alignItems: "center", flex: 1 }}
          >
            {leftLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text)",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  padding: "4px 0",
                  textTransform: "uppercase",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Center logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
            }}
          >
            <img
              src="/logo.png"
              alt="toywheels logo"
              style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
              onClick={() => router.push("/")}
            />
          </div>

          {/* Right links + cart — desktop */}
          <div
            className="hidden md:flex"
            style={{ gap: "32px", alignItems: "center", flex: 1, justifyContent: "flex-end" }}
          >
            {rightLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text)",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  padding: "4px 0",
                  textTransform: "uppercase",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                }}
              >
                {link.label}
              </button>
            ))}

            {/* Cart button */}
            <button
              aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              onClick={() => router.push("/checkout")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                borderRadius: "6px",
                transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid var(--accent)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-6px",
                    background: "var(--accent)",
                    color: "#000000",
                    fontSize: "11px",
                    fontWeight: 700,
                    width: "18px",
                    height: "18px",
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-body)",
                    lineHeight: 1,
                    transform: badgePulse ? "scale(1.35)" : "scale(1)",
                    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden" style={{ alignItems: "center", gap: "16px" }}>
            <button
              aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              onClick={() => router.push("/checkout")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                borderRadius: "6px",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid var(--accent)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-6px",
                    background: "var(--accent)",
                    color: "#000000",
                    fontSize: "11px",
                    fontWeight: 700,
                    width: "18px",
                    height: "18px",
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-body)",
                    lineHeight: 1,
                    transform: badgePulse ? "scale(1.35)" : "scale(1)",
                    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
                width: "32px",
                height: "32px",
                outline: "none",
                borderRadius: "4px",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid var(--accent)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "var(--text)",
                  borderRadius: "2px",
                  transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                  transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "var(--text)",
                  borderRadius: "2px",
                  opacity: mobileOpen ? 0 : 1,
                  transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "var(--text)",
                  borderRadius: "2px",
                  transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
                  transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            top: "80px",
            background: "var(--bg)",
            zIndex: 49,
            display: "flex",
            flexDirection: "column",
            padding: "40px 32px",
            gap: "0",
            overflowY: "auto",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {[...leftLinks, ...rightLinks].map((link, idx) => (
              <button
                key={link.label + idx}
                onClick={link.action}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid #2e2e2e",
                  color: "var(--text)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "28px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  padding: "16px 0",
                  textAlign: "left",
                  textTransform: "uppercase",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  outline: "none",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.outline = "2px solid var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "40px" }}>
            <button
              onClick={() => { setMobileOpen(false); router.push("/checkout"); }}
              style={{
                background: "var(--primary)",
                border: "none",
                color: "#fff",
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: "pointer",
                padding: "16px 32px",
                borderRadius: "var(--radius-md)",
                textTransform: "uppercase",
                width: "100%",
                transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "3px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              View Cart ({totalItems})
            </button>
          </div>
        </div>
      )}
    </>
  );
}