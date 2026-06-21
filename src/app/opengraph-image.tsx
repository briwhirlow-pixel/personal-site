import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "byBrian Web Design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #0A1628 0%, #0F2444 50%, #0A1628 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "48px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "#2563EB",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "800",
              color: "white",
            }}
          >
            B
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "white", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px" }}>
              by<span style={{ color: "#2563EB" }}>Brian</span>
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase" }}>
              Web Design
            </span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "900",
            color: "white",
            lineHeight: "1.05",
            letterSpacing: "-2px",
            marginBottom: "24px",
            maxWidth: "820px",
          }}
        >
          Websites that{" "}
          <span style={{ color: "#2563EB" }}>grow</span>
          {" "}your business.
        </div>

        {/* Subtext */}
        <div style={{ fontSize: "22px", color: "rgba(255,255,255,0.5)", maxWidth: "600px" }}>
          Fast, beautiful websites that convert visitors into customers.
        </div>

        {/* URL badge */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "80px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "100px",
            padding: "10px 24px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "16px",
            letterSpacing: "0.5px",
          }}
        >
          builtbybwhirl.com
        </div>
      </div>
    ),
    { ...size }
  );
}
