export async function get({ params }) {
  const { id } = params;

  const rawId = id.replace(".png", "");

  const mon = parseInt(rawId, 10);
  if (typeof mon !== "number")
    return new Response("Not found", { status: 404 });

  const data = await fetch(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${mon}.png`
  );

  data.headers.set("Cache-Control", "max-age=31536000, immutable");

  return data;
}
