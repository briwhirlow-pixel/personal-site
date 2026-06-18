import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          borderRadius: 6,
        }}
      >
        <span style={{ display: 'flex', fontSize: 14, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.05em' }}>
          <span style={{ color: '#1A1A2E' }}>b</span>
          <span style={{ color: '#2563EB' }}>b</span>
          <span style={{ color: '#1A1A2E' }}>b</span>
        </span>
      </div>
    ),
    { ...size }
  );
}
