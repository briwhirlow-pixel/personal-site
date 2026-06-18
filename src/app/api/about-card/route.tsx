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
          width: 1080,
          height: 1350,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ECEBE6',
          padding: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 980,
            height: 1250,
            background: '#F5F4F1',
            border: '2px solid #E2E8F0',
            padding: '44px 40px 40px 40px',
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#1A1A2E',
              letterSpacing: '-0.025em',
              lineHeight: 1,
            }}
          >
            Brian Whirlow
          </span>

          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#64748B',
              letterSpacing: '-0.02em',
              marginTop: 10,
            }}
          >
            Designer & Developer · South Jersey / Philadelphia
          </span>

          <div
            style={{
              display: 'flex',
              marginTop: 40,
              width: 900,
              height: 940,
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 445,
                height: 940,
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', width: 445, height: 465, overflow: 'hidden', border: '2px solid #E2E8F0' }}>
                <img
                  src={youngSrc}
                  width={445}
                  height={465}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', width: 445, height: 465, overflow: 'hidden', border: '2px solid #E2E8F0' }}>
                <img
                  src={beachSrc}
                  width={445}
                  height={465}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', width: 445, height: 940, overflow: 'hidden', border: '2px solid #E2E8F0' }}>
              <img
                src={nowSrc}
                width={445}
                height={940}
                style={{ objectFit: 'cover' }}
              />
            </div>
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
