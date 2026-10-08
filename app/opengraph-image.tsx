import { ImageResponse } from "next/og";
export const alt = "Eskişehir Genel Arıza";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  const cols = ["#36dcff", "#d7ff1f", "#ff5b14", "#1fe0c4"];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#070708", color: "#ecebe4", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
        <div style={{ display: "flex", gap: 14 }}>
          {cols.map((c) => (<div key={c} style={{ width: 54, height: 54, borderRadius: 12, background: c }} />))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4 }}>
          <span>ESKISEHIR</span>
          <span style={{ color: "#d7ff1f" }}>GENEL ARIZA</span>
        </div>
        <div style={{ fontSize: 32, color: "#8d8f8a" }}>Su · Elektrik · Kombi · Beyaz esya: dogru yonlendirme</div>
      </div>
    ),
    size,
  );
}
