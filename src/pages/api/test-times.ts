export async function get({ params }) {
  const dateTime = new Date();

  return new Response(JSON.stringify({ dateTime: dateTime.toLocaleString() }), {
    headers: {
      "Cache-Control": `s-maxage=10000, stale-while-revalidate`,
    },
  });
}
