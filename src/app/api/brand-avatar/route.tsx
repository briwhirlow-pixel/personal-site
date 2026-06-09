import { ImageResponse } from "next/og";

export const runtime = "edge";

const TEXT = "Built by Brian";

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

  const [instrumentRegular, instrumentItalic] = await Promise.all([
    loadGoogleFont(`family=Instrument+Serif&text=${subset}`),
    loadGoogleFont(`family=Instrument+Serif:ital@1&text=${subset}`),
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
          {/* Inner screen */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              width: 740,
              height: 440,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 22,
              padding: "0 60px",
            }}
          >
            {/* Forest dot */}
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 16,
                background: "#2D6A4F",
                display: "flex",
                flexShrink: 0,
              }}
            />
            {/* Wordmark — single line with italic "by" in clay */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                fontFamily: "Instrument Serif",
                fontSize: 132,
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
      ],
      headers: {
        "Content-Disposition": 'attachment; filename="builtbybrian-avatar.png"',
        "Cache-Control": "public, max-age=3600, immutable",
      },
    }
  );
}
