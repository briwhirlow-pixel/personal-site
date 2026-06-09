import { igPosts } from "@/lib/igPosts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing Images — Instagram Post Library",
  robots: { index: false, follow: false },
};

export default function MarketingImagesPage() {
  return (
    <main
      style={{
        background: "#E9EDF3",
        minHeight: "100vh",
        padding: "40px 20px 120px",
        fontFamily: "var(--font-outfit), system-ui, sans-serif",
        color: "#1A1A2E",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <header
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 10,
            padding: "32px 28px",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#64748B",
              marginBottom: 18,
              paddingBottom: 14,
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 8,
                background: "#0EA5E9",
                display: "inline-block",
              }}
            />
            BuiltbyBrian · Instagram Post Library · 22 posts
          </div>
          <h1
            style={{
              fontFamily: "var(--font-instrument), Georgia, serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Real PNG images.{" "}
            <span style={{ fontStyle: "italic", color: "#2563EB" }}>
              Download. Post.
            </span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#475569",
              maxWidth: 720,
              marginTop: 18,
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Each post below is a real 1080×1350 PNG rendered server-side — the
            same size Instagram uses for portrait posts. Click <strong>Download PNG</strong> to
            save the file to your device. Captions are above each one — long-press
            on phone to copy.
          </p>
        </header>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {igPosts.map((post) => (
            <article
              key={post.id}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image — 4:5 portrait */}
              <a
                href={`/api/ig-post/${post.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  aspectRatio: "4 / 5",
                  background: "#E9EDF3",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/ig-post/${post.id}`}
                  alt={`Post ${post.id} — ${post.name}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </a>

              {/* Card body */}
              <div
                style={{
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#2563EB",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Post {post.id}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-instrument), Georgia, serif",
                      fontSize: 19,
                      lineHeight: 1.2,
                      color: "#1A1A2E",
                      marginBottom: 6,
                    }}
                  >
                    {post.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#64748B",
                      fontWeight: 600,
                    }}
                  >
                    {post.type}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <a
                    href={`/api/ig-post/${post.id}`}
                    download={`builtbybrian-post-${post.id}.png`}
                    style={{
                      flex: 1,
                      background: "#2563EB",
                      color: "#FFFFFF",
                      textDecoration: "none",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      padding: "11px 12px",
                      borderRadius: 5,
                      textAlign: "center",
                    }}
                  >
                    Download PNG
                  </a>
                  <a
                    href={`/api/ig-post/${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#FFFFFF",
                      color: "#2563EB",
                      border: "1px solid #2563EB",
                      textDecoration: "none",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      padding: "11px 14px",
                      borderRadius: 5,
                      textAlign: "center",
                    }}
                  >
                    View
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer
          style={{
            marginTop: 40,
            padding: "24px 0",
            textAlign: "center",
            color: "#64748B",
            fontSize: 13,
            borderTop: "1px solid #CBD5E1",
          }}
        >
          builtbybwhirl.com · captions in /marketing/captions.txt
        </footer>
      </div>
    </main>
  );
}
