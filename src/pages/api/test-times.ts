export async function get({ params }) {
  const dateTime = new Date();

  return new Response(JSON.stringify({ dateTime: dateTime.toLocaleString() }), {
    headers: {
      "Cache-Control": `s-maxage=1, stale-while-revalidate`,
    },
  });
}
