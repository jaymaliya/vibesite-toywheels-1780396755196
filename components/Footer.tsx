"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer
      style={{
        background: "var(--bg)",
        borderTop: "1px solid #2e2e2e",
        fontFamily: "var(--font-body)",
        color: "var(--text)",
        paddingTop: "64px",
        paddingBottom: "40px",
      }}
      aria-label="Site footer"
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Top section: 3-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "48px",
            marginBottom: "56px",
          }}
        >
          {/* Column 1: Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <img
              src="/logo.png"
              alt="toywheels logo"
              style={{ height: "32px", objectFit: "contain", opacity: 0.85, alignSelf: "flex-start" }}
            />
            <p
              style={{
                color: "var(--muted)",
                fontSize: "14px",
                lineHeight: "1.7",
                maxWidth: "280px",
              }}
            >
              We sell happiness — one die-cast at a time. Premium model cars for collectors, enthusiasts, and dreamers across India.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow toywheels on Instagram"
                style={{
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface)",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--accent)";
                  el.style.background = "#3a3a3a";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--muted)";
                  el.style.background = "var(--surface)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "none";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow toywheels on Twitter"
                style={{
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface)",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--accent)";
                  el.style.background = "#3a3a3a";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--muted)";
                  el.style.background = "var(--surface)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "none";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/917000000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with toywheels on WhatsApp"
                style={{
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface)",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--accent)";
                  el.style.background = "#3a3a3a";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--muted)";
                  el.style.background = "var(--surface)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = "none";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text)",
                margin: 0,
              }}
            >
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Home", action: () => router.push("/") },
                  { label: "Shop", action: () => router.push("/shop") },
                  { label: "New Arrivals", action: () => router.push("/shop") },
                  { label: "Brands", action: () => router.push("/shop") },
                  { label: "Contact", action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
                  { label: "Support", action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
                ].map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--muted)",
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        cursor: "pointer",
                        padding: 0,
                        textAlign: "left",
                        transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                        outline: "none",
                        letterSpacing: "0.02em",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
                      }}
                      onFocus={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                        (e.currentTarget as HTMLButtonElement).style.outline = "2px solid var(--accent)";
                        (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                      }}
                      onBlur={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
                        (e.currentTarget as HTMLButtonElement).style.outline = "none";
                      }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact email */}
            <div style={{ marginTop: "8px" }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text)",
                  marginBottom: "8px",
                }}
              >
                Contact Us
              </span>
              <a
                href="mailto:maliyajay77@gmail.com"
                style={{
                  color: "var(--muted)",
                  fontSize: "14px",
                  fontFamily: "var(--font-body)",
                  textDecoration: "none",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                  (e.currentTarget as HTMLAnchorElement).style.outline = "none";
                }}
              >
                maliyajay77@gmail.com
              </a>
            </div>
          </div>

          {/* Column 3: Newsletter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text)",
                margin: 0,
              }}
            >
              Stay in the Loop
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "14px",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              New drops, restocks, and collector news — delivered to your inbox. Free shipping on orders above ₹999.
            </p>

            {status === "success" ? (
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid #2d5a2d",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  color: "#6fcf6f",
                  fontSize: "14px",
                  fontFamily: "var(--font-body)",
                  lineHeight: "1.5",
                }}
                role="status"
                aria-live="polite"
              >
                Thanks! We'll be in touch.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                noValidate
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label
                    htmlFor="footer-email"
                    style={{
                      fontSize: "12px",
                      fontFamily: "var(--font-body)",
                      color: "var(--muted)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    aria-required="true"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid #3a3a3a",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text)",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      padding: "12px 16px",
                      outline: "none",
                      transition: "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor = "var(--accent)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor = "#3a3a3a";
                    }}
                  />
                </div>

                {status === "error" && (
                  <p
                    style={{
                      color: "var(--primary)",
                      fontSize: "13px",
                      fontFamily: "var(--font-body)",
                      margin: 0,
                    }}
                    role="alert"
                  >
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-disabled={status === "loading"}
                  style={{
                    background: status === "loading" ? "var(--muted)" : "var(--primary)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    color: "#fff",
                    fontFamily: "var(--font-heading)",
                    fontSize: "16px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "14px 24px",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
                    outline: "none",
                    width: "100%",
                    opacity: status === "loading" ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                  }}
                  onMouseDown={(e) => {
                    if (status !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                    }
                  }}
                  onMouseUp={(e) => {
                    if (status !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline = "2px solid var(--accent)";
                    (e.currentTarget as HTMLButtonElement).style.outlineOffset = "3px";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline = "none";
                  }}
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid #2e2e2e",
            paddingTop: "32px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              color: "var(--muted)",
              fontSize: "13px",
              fontFamily: "var(--font-body)",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} toywheels — we sell happiness. Made in India.
          </p>

          <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
            <span
              style={{
                color: "var(--muted)",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              UPI &amp; Cards accepted
            </span>
            <span
              style={{
                color: "var(--muted)",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
              Free shipping above ₹999
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}