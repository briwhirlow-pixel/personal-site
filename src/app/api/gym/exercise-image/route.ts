import { NextResponse } from "next/server";

const cache = new Map<string, string | null>();

// ExerciseDB via RapidAPI — animated GIFs, best coverage
// Requires RAPIDAPI_KEY env var (free tier: 500 req/day at rapidapi.com → search "ExerciseDB")
async function searchExerciseDB(name: string): Promise<string | null> {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return null;

  try {
    // Try exact name first, then first two words
    const terms = [name, name.split(" ").slice(0, 2).join(" ")].filter(
      (v, i, a) => a.indexOf(v) === i
    );

    for (const term of terms) {
      const res = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(term.toLowerCase())}?limit=1&offset=0`,
        {
          headers: {
            "X-RapidAPI-Key": key,
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
          next: { revalidate: 86400 },
        }
      );
      if (!res.ok) continue;
      const data: Array<{ gifUrl?: string }> = await res.json();
      if (data[0]?.gifUrl) return data[0].gifUrl;
    }
    return null;
  } catch {
    return null;
  }
}

// wger.de — static images, fallback when ExerciseDB key not set
const WGER_BASE = "https://wger.de";

async function searchWger(name: string): Promise<string | null> {
  try {
    const words = name.trim().split(/\s+/);
    const terms = [name, words.slice(0, 2).join(" "), words[0]].filter(
      (v, i, a) => a.indexOf(v) === i
    );

    for (const term of terms) {
      const res = await fetch(
        `${WGER_BASE}/api/v2/exercise/search/?term=${encodeURIComponent(term)}&language=english&format=json`,
        { next: { revalidate: 86400 } }
      );
      if (!res.ok) continue;

      const data = await res.json();
      const suggestions: Array<{
        value: string;
        data: { id: number; base_id: number; image: string | null };
      }> = data.suggestions ?? [];

      const withImage = suggestions.find((s) => s.data.image);
      if (withImage?.data.image) {
        return withImage.data.image.startsWith("http")
          ? withImage.data.image
          : `${WGER_BASE}${withImage.data.image}`;
      }

      const first = suggestions[0];
      if (!first) continue;

      const imgRes = await fetch(
        `${WGER_BASE}/api/v2/exerciseimage/?exercise=${first.data.base_id}&format=json`,
        { next: { revalidate: 86400 } }
      );
      if (!imgRes.ok) continue;

      const imgData = await imgRes.json();
      const images: Array<{ image: string; is_main: boolean }> = imgData.results ?? [];
      const main = images.find((i) => i.is_main) ?? images[0];
      if (main?.image) {
        return main.image.startsWith("http") ? main.image : `${WGER_BASE}${main.image}`;
      }
    }
    return null;
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
    const cached = cache.get(cacheKey) ?? null;
    return NextResponse.json({ imageUrl: cached }, {
      headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
    });
  }

  // Try ExerciseDB first (GIFs), fall back to wger.de (static images)
  let imageUrl = await searchExerciseDB(name);
  if (!imageUrl) imageUrl = await searchWger(name);

  cache.set(cacheKey, imageUrl);
  return NextResponse.json({ imageUrl }, {
    headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
  });
}
