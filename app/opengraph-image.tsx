import { ImageResponse } from "next/og";

export const alt = "Naoki Atkins — Data Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same rising trend as the homepage animation
const BARS = [0.35, 0.55, 0.45, 0.7, 0.6, 0.85, 0.75, 1];
const ROWS = 14;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px",
          background: "#F5F0E8",
          color: "#1A1614",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>Naoki Atkins</div>
          <div style={{ fontSize: 48, color: "#C4501A", marginTop: 8 }}>Data Engineer</div>
          <div style={{ fontSize: 30, color: "#6B645C", marginTop: 32, lineHeight: 1.4 }}>
            {"Trustworthy data pipelines and clear Power BI reports."}
          </div>
          <div style={{ fontSize: 24, color: "#6B645C", marginTop: 48 }}>www.naokiatkins.com</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 360 }}>
          {BARS.map((h, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column-reverse", gap: 6 }}>
              {Array.from({ length: Math.round(h * ROWS) }, (_, r) => (
                <div key={r} style={{ display: "flex", gap: 6 }}>
                  {[0, 1].map((c) => (
                    <div
                      key={c}
                      style={{ width: 10, height: 10, borderRadius: 5, background: "#C4501A", opacity: 0.75 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
