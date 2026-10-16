import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const dynamic = "force-static";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "radial-gradient(circle at 75% 35%, #3a2f8a 0%, #0b0b0f 55%)",
        color: "#f4efe6",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 28, color: "#67e0f0", letterSpacing: 4, textTransform: "uppercase" }}>
        {profile.title}
      </div>
      <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.08, maxWidth: 980 }}>
        {profile.positioning}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#b4aea4" }}>
        <span>{profile.name}</span>
        <span>{profile.location}</span>
      </div>
    </div>,
    size,
  );
}
