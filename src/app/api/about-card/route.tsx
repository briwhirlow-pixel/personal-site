import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';

export async function GET() {
  const [youngBuf, beachBuf, nowBuf] = await Promise.all([
    readFile(join(process.cwd(), 'public/images/brian-young.jpg')),
    readFile(join(process.cwd(), 'public/images/brian-beach.jpg')),
    readFile(join(process.cwd(), 'public/images/brian-now.jpg')),
  ]);

  const youngSrc = `data:image/jpeg;base64,${youngBuf.toString('base64')}`;
  const beachSrc = `data:image/jpeg;base64,${beachBuf.toString('base64')}`;
  const nowSrc = `data:image/jpeg;base64,${nowBuf.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ECEBE6',
          padding: 60,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            background: '#F5F4F1',
            border: '2px solid #E2E8F0',
            padding: 48,
          }}
        >
          {/* Name */}
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#1A1A2E',
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              textAlign: 'center',
            }}
          >
            Brian Whirlow
          </span>

          {/* Title */}
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#64748B',
              letterSpacing: '-0.025em',
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            Designer & Developer · South Jersey / Philadelphia
          </span>

          {/* Photos */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              marginTop: 48,
              width: '100%',
              flex: 1,
            }}
          >
            {/* Left — stacked */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                width: '50%',
              }}
            >
              <img
                src={youngSrc}
                style={{
                  width: '100%',
                  flex: 1,
                  objectFit: 'cover',
                  border: '2px solid #E2E8F0',
                }}
              />
              <img
                src={beachSrc}
                style={{
                  width: '100%',
                  flex: 1,
                  objectFit: 'cover',
                  border: '2px solid #E2E8F0',
                }}
              />
            </div>

            {/* Right — full height */}
            <img
              src={nowSrc}
              style={{
                width: '50%',
                objectFit: 'cover',
                border: '2px solid #E2E8F0',
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      headers: {
        'Content-Disposition': 'attachment; filename="brian-whirlow-about.png"',
      },
    }
  );
}
