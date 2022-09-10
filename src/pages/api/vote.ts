const VOTE_SQL_STRING =
  "INSERT INTO `roundest-mon`.Vote (id,votedForId,votedAgainstId) VALUES (?, ?, ?)";

import { connect } from "@planetscale/database";
import { nanoid } from "nanoid";

export const makeVote = async (voteFor: number, voteAgainst: number) => {
  const conn = connect({
    host: import.meta.env.DATABASE_HOST,
    username: import.meta.env.DATABASE_USERNAME,
    password: import.meta.env.DATABASE_PASSWORD,
  });
  return await conn.execute(VOTE_SQL_STRING, [nanoid(), voteFor, voteAgainst]);
};

import { z } from "zod";
export async function post({ request }) {
  const data = await request.json();

  const validated = z
    .object({ voteFor: z.number(), voteAgainst: z.number() })
    .parse(data);

  const res = await makeVote(validated.voteFor, validated.voteAgainst);
  return new Response(JSON.stringify({ done: res }));
}
