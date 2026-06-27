import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = "Ifiok Columba, AI Automation Engineer & Full-Stack Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fafaf8",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "2px solid #0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 600,
              color: "#0a0a0a",
            }}
          >
            IC
          </div>
          <span style={{ fontSize: 20, color: "#6b6f76", letterSpacing: 2 }}>
            IFIOK COLUMBA
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 56,
              fontWeight: 600,
              color: "#0a0a0a",
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            AI Automation Engineer &amp; Full-Stack Builder
          </span>
          <span style={{ fontSize: 24, color: "#6b6f76", maxWidth: 820 }}>
            {profile.subhead}
          </span>
        </div>

        <div style={{ display: "flex", gap: 32 }}>
          {profile.stats.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 28, fontWeight: 600, color: "#0a0a0a" }}>
                {s.value}
              </span>
              <span style={{ fontSize: 14, color: "#6b6f76", letterSpacing: 1 }}>
                {s.label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
