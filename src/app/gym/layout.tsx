import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Gym Tracker',
  description: 'Personal gym tracking app',
  manifest: '/gym/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Gym Tracker',
  },
  icons: {
    apple: '/gym/icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
};

export default function GymLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <script
        dangerouslySetInnerHTML={{
          __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/gym/sw.js',{scope:'/gym'})}`,
        }}
      />
    </>
  );
}
