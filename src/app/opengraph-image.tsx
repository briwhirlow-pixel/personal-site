import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BuiltbyBrian — Hand-built websites for small businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TEXT = "BuiltbyBrian Hand-built websites for small businesses Philadelphia South Jersey 5-day first drafts You own the code ";

async function loadGoogleFont(query: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?${query}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('([^']+)'\)/);
  if (!match) throw new Error(`No font URL parsed: ${query}`);
  const res = await fetch(match[1]);
  return res.arrayBuffer();
}

export default async function Image() {
  const subset = encodeURIComponent(TEXT);
  const [instrumentRegular, instrumentItalic, mono] = await Promise.all([
    loadGoogleFont(`family=Instrument+Serif&text=${subset}`),
    loadGoogleFont(`family=Instrument+Serif:ital@1&text=${subset}`),
    loadGoogleFont(`family=JetBrains+Mono:wght@600&text=${subset}`),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#E9EDF3",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          fontFamily: "Instrument Serif",
          position: "relative",
        }}
      >
        {/* Editorial header rule */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingBottom: 18,
            borderBottom: "1px solid #CBD5E1",
            fontFamily: "JetBrains Mono",
            fontSize: 16,
            letterSpacing: 4,
            color: "#64748B",
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 12,
                background: "#B7541F",
                display: "flex",
              }}
            />
            Philadelphia · South Jersey
          </span>
          <span style={{ display: "flex" }}>builtbybwhirl.com</span>
        </div>

        {/* Headline */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Instrument Serif",
              fontSize: 110,
              color: "#1A1A2E",
              lineHeight: 0.95,
              letterSpacing: -3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ display: "flex" }}>Hand-built websites</span>
            <span style={{ display: "flex" }}>
              <span style={{ fontFamily: "Instrument Serif", fontStyle: "italic", color: "#2D6A4F" }}>
                for small businesses.
              </span>
            </span>
          </div>
        </div>

        {/* Footer wordmark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingTop: 18,
            borderTop: "1px solid #CBD5E1",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                background: "#2D6A4F",
                display: "flex",
                marginRight: 4,
              }}
            />
            <span
              style={{
                fontFamily: "Instrument Serif",
                fontSize: 44,
                color: "#1A1A2E",
                display: "flex",
              }}
            >
              Built
            </span>
            <span
              style={{
                fontFamily: "Instrument Serif",
                fontSize: 44,
                fontStyle: "italic",
                color: "#B7541F",
                display: "flex",
              }}
            >
              by
            </span>
            <span
              style={{
                fontFamily: "Instrument Serif",
                fontSize: 44,
                color: "#1A1A2E",
                display: "flex",
              }}
            >
              Brian
            </span>
          </div>
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 16,
              letterSpacing: 4,
              color: "#64748B",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            5-day first drafts · You own the code
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: instrumentRegular, weight: 400, style: "normal" },
        { name: "Instrument Serif", data: instrumentItalic, weight: 400, style: "italic" },
        { name: "JetBrains Mono", data: mono, weight: 600, style: "normal" },
      ],
    }
  );
}
