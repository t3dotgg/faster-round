const VOTE_SQL_STRING =
  "INSERT INTO `roundest-mon`.Vote (id,votedForId,votedAgainstId) VALUES (?, ?, ?)";

import { connect } from "@planetscale/database";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const makeVote = async (voteFor: number, voteAgainst: number) => {
  const conn = connect({
    host: import.meta.env.DATABASE_HOST,
    username: import.meta.env.DATABASE_USERNAME,
    password: import.meta.env.DATABASE_PASSWORD,
  });
  return await conn.execute(VOTE_SQL_STRING, [uuid(), voteFor, voteAgainst]);
};

const redis = new Redis({
  url: import.meta.env.UPSTASH_REDIS_REST_URL!,
  token: import.meta.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(20, "10 s"),
});

export async function post({ request }) {
  // This is terribly cursed.
  // I hope there's a better way to get a request IP
  // without this madness
  const ip =
    request[
      Object.getOwnPropertySymbols(request)[import.meta.env.DEV ? 2 : 0]
    ] ?? "127.0.0.1";
  console.log("ip?", ip);
  console.log("request?", request.headers.get("x-forwarded-for"));
  console.log("protos?", Object.getOwnPropertySymbols(request));

  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    `mw_${ip}`
  );

  // Wait for any multi region sync shit
  await pending;

  if (!success) return new Response("Too many requests", { status: 429 });

  const data = await request.json();

  const validated = z
    .object({ voteFor: z.number(), voteAgainst: z.number() })
    .parse(data);

  const res = await makeVote(validated.voteFor, validated.voteAgainst);
  return new Response(JSON.stringify({ done: res }));
}
