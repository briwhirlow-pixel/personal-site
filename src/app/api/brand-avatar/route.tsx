import { ImageResponse } from "next/og";

export const runtime = "edge";

const TEXT = "Built by Brian WEB DESIGN";

async function loadGoogleFont(query: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?${query}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('([^']+)'\)/);
  if (!match) throw new Error(`No font URL parsed from CSS for ${query}`);
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Failed to fetch font (${res.status})`);
  return res.arrayBuffer();
}

export async function GET() {
  const subset = encodeURIComponent(TEXT);

  const [instrumentRegular, instrumentItalic, jetbrainsMono] = await Promise.all([
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Monitor bezel */}
        <div
          style={{
            background: "#1A1A2E",
            borderRadius: 36,
            padding: 22,
            display: "flex",
            boxShadow: "0 40px 100px -36px rgba(26,26,46,0.45)",
          }}
        >
          {/* Inner screen — wordmark stacked over tagline */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              width: 760,
              height: 440,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 28,
              padding: "0 50px",
            }}
          >
            {/* Wordmark row — dot + Built[italic by]Brian */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 22,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 16,
                  background: "#2D6A4F",
                  display: "flex",
                  flexShrink: 0,
                  alignSelf: "center",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  fontFamily: "Instrument Serif",
                  fontSize: 118,
                  color: "#1A1A2E",
                  lineHeight: 1,
                  letterSpacing: -3,
                }}
              >
                <span style={{ display: "flex" }}>Built</span>
                <span
                  style={{
                    display: "flex",
                    fontStyle: "italic",
                    color: "#0EA5E9",
                    padding: "0 6px",
                  }}
                >
                  by
                </span>
                <span style={{ display: "flex" }}>Brian</span>
              </div>
            </div>

            {/* Thin divider */}
            <div
              style={{
                width: 200,
                height: 2,
                background: "#CBD5E1",
                display: "flex",
              }}
            />

            {/* WEB DESIGN tagline */}
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: 11,
                textTransform: "uppercase",
                color: "#64748B",
                display: "flex",
              }}
            >
              Web Design
            </div>
          </div>
        </div>

        {/* Stand neck */}
        <div
          style={{
            width: 90,
            height: 36,
            background: "#1A1A2E",
            display: "flex",
            marginTop: 4,
          }}
        />
        {/* Stand base */}
        <div
          style={{
            width: 260,
            height: 16,
            background: "#1A1A2E",
            borderRadius: 12,
            marginTop: 2,
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: [
        { name: "Instrument Serif", data: instrumentRegular, weight: 400, style: "normal" },
        { name: "Instrument Serif", data: instrumentItalic, weight: 400, style: "italic" },
        { name: "JetBrains Mono", data: jetbrainsMono, weight: 600, style: "normal" },
      ],
      headers: {
        "Content-Disposition": 'attachment; filename="builtbybrian-avatar.png"',
        "Cache-Control": "public, max-age=3600, immutable",
      },
    }
  );
}
