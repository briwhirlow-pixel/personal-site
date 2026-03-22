import { NextResponse } from "next/server";

const WGER_BASE = "https://wger.de";
const cache = new Map<string, string | null>();

async function searchWger(term: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${WGER_BASE}/api/v2/exercise/search/?term=${encodeURIComponent(term)}&language=english&format=json`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const suggestions: Array<{
      value: string;
      data: { id: number; base_id: number; image: string | null };
    }> = data.suggestions ?? [];

    // Find the first suggestion that has an image
    const withImage = suggestions.find((s) => s.data.image);
    if (withImage?.data.image) {
      return withImage.data.image.startsWith("http")
        ? withImage.data.image
        : `${WGER_BASE}${withImage.data.image}`;
    }

    // No image in search results — try fetching via the exercise image endpoint using base_id
    const first = suggestions[0];
    if (!first) return null;

    const imgRes = await fetch(
      `${WGER_BASE}/api/v2/exerciseimage/?exercise=${first.data.base_id}&format=json`,
      { next: { revalidate: 86400 } }
    );
    if (!imgRes.ok) return null;

    const imgData = await imgRes.json();
    const images: Array<{ image: string; is_main: boolean }> =
      imgData.results ?? [];
    const main = images.find((i) => i.is_main) ?? images[0];
    if (!main?.image) return null;

    return main.image.startsWith("http")
      ? main.image
      : `${WGER_BASE}${main.image}`;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const cacheKey = name.toLowerCase();
  if (cache.has(cacheKey)) {
    return NextResponse.json({ imageUrl: cache.get(cacheKey) ?? null });
  }

  // Try full name first, then first two words, then first word
  const words = name.trim().split(/\s+/);
  const fallbacks = [
    name,
    words.slice(0, 2).join(" "),
    words[0],
  ].filter((v, i, arr) => arr.indexOf(v) === i); // dedupe

  let imageUrl: string | null = null;
  for (const term of fallbacks) {
    imageUrl = await searchWger(term);
    if (imageUrl) break;
  }

  cache.set(cacheKey, imageUrl);
  return NextResponse.json({ imageUrl });
}
