import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Subset of characters actually rendered — keeps font payloads small.
const TEXT = 'Built by Brian WEB DESIGN';

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
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
          border: '4px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Instrument Serif',
        }}
      >
        {/* Forest dot */}
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 26,
            background: '#2D6A4F',
            marginBottom: 34,
            display: 'flex',
          }}
        />

        {/* "Built" */}
        <div
          style={{
            fontFamily: 'Instrument Serif',
            fontSize: 172,
            color: '#1A1A2E',
            lineHeight: 1,
            letterSpacing: -4,
            display: 'flex',
          }}
        >
          Built
        </div>

        {/* "by Brian" */}
        <div
          style={{
            fontSize: 172,
            lineHeight: 1,
            letterSpacing: -4,
            marginTop: 10,
            display: 'flex',
          }}
        >
          <span
            style={{
              fontFamily: 'Instrument Serif',
              fontStyle: 'italic',
              color: '#0EA5E9',
              display: 'flex',
            }}
          >
            by&nbsp;
          </span>
          <span
            style={{
              fontFamily: 'Instrument Serif',
              color: '#1A1A2E',
              display: 'flex',
            }}
          >
            Brian
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 220,
            height: 4,
            background: '#CBD5E1',
            marginTop: 56,
            marginBottom: 32,
            display: 'flex',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 46,
            letterSpacing: 14,
            color: '#64748B',
            fontWeight: 600,
            display: 'flex',
          }}
        >
          WEB DESIGN
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: [
        { name: 'Instrument Serif', data: instrumentRegular, weight: 400, style: 'normal' },
        { name: 'Instrument Serif', data: instrumentItalic, weight: 400, style: 'italic' },
        { name: 'JetBrains Mono', data: jetbrainsMono, weight: 600, style: 'normal' },
      ],
      headers: {
        'Content-Disposition': 'attachment; filename="builtbybrian-avatar.png"',
        'Cache-Control': 'public, max-age=3600, immutable',
      },
    }
  );
}
