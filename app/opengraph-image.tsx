import { ImageResponse } from "next/og";

export const alt = "Zyro Studios — Affordable Freelance Web Developer & Digital Products";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#030712",
          fontFamily: "sans-serif",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Ambient Radial Glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "350px",
            background: "radial-gradient(circle, rgba(0, 132, 255, 0.35) 0%, transparent 70%)",
          }}
        />

        {/* Eyebrow Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 24px",
            borderRadius: "9999px",
            background: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              color: "#38bdf8",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Senior Freelance Engineer • High-Agency Delivery
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "68px",
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "16px",
            letterSpacing: "-2px",
          }}
        >
          ZYRO STUDIOS
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "850px",
            lineHeight: 1.45,
            marginBottom: "40px",
          }}
        >
          Bespoke Next.js web applications, digital platforms, and e-commerce stores engineered at budget-friendly freelance rates.
        </div>

        {/* Pill Badges */}
        <div style={{ display: "flex", gap: "14px" }}>
          {["Next.js & React", "Affordable Pricing", "100% Custom Code", "Sub-Second Speed"].map((badge) => (
            <div
              key={badge}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#e2e8f0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

