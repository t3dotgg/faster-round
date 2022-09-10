export async function get({ params }) {
  const dateTime = new Date();

  return new Response(JSON.stringify({ dateTime: dateTime.toLocaleString() }), {
    headers: {
      "Cache-Control": `max-age=0, s-maxage=86400`,
    },
  });
}
