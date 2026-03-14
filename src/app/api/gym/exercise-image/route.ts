import { NextResponse } from "next/server";

const cache = new Map<string, string>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const cacheKey = name.toLowerCase();
  if (cache.has(cacheKey)) {
    return NextResponse.json({ imageUrl: cache.get(cacheKey) });
  }

  try {
    // Search wger for the exercise by name
    const searchRes = await fetch(
      `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(name)}&language=english&format=json`,
      { next: { revalidate: 86400 } }
    );

    if (!searchRes.ok) {
      return NextResponse.json({ imageUrl: null });
    }

    const searchData = await searchRes.json();
    const suggestions: Array<{ id: number; base_id: number }> =
      searchData.suggestions ?? [];

    if (suggestions.length === 0) {
      return NextResponse.json({ imageUrl: null });
    }

    const baseId = suggestions[0].base_id;

    // Get images for this exercise
    const imgRes = await fetch(
      `https://wger.de/api/v2/exerciseimage/?exercise=${baseId}&format=json`,
      { next: { revalidate: 86400 } }
    );

    if (!imgRes.ok) {
      return NextResponse.json({ imageUrl: null });
    }

    const imgData = await imgRes.json();
    const images: Array<{ image: string; is_main: boolean }> =
      imgData.results ?? [];

    const main = images.find((i) => i.is_main) ?? images[0];
    const imageUrl = main?.image ?? null;

    if (imageUrl) cache.set(cacheKey, imageUrl);

    return NextResponse.json({ imageUrl });
  } catch {
    return NextResponse.json({ imageUrl: null });
  }
}
