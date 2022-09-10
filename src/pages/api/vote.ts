const VOTE_SQL_STRING =
  "INSERT INTO `roundest-mon`.Vote (id,votedForId,votedAgainstId) VALUES (?, ?, ?)";

// 'INSERT INTO `roundest-mon`.Vote (id,createdAt,votedForId,votedAgainstId) VALUES ("cl7vrh5rq0000glq74e31nguf", "2022-09-10 10:25:24.086 UTC", 22, 447)';

import { connect } from "@planetscale/database";
import { v4 as uuidv4 } from "uuid";

import { z } from "zod";
export const makeVote = async (voteFor: number, voteAgainst: number) => {
  const conn = connect({
    host: import.meta.env.DATABASE_HOST,
    username: import.meta.env.DATABASE_USERNAME,
    password: import.meta.env.DATABASE_PASSWORD,
  });
  return await conn.execute(VOTE_SQL_STRING, [uuidv4(), voteFor, voteAgainst]);
};

export async function post({ request }) {
  const data = await request.json();

  const validated = z
    .object({ voteFor: z.number(), voteAgainst: z.number() })
    .parse(data);

  const res = await makeVote(validated.voteFor, validated.voteAgainst);
  return new Response(JSON.stringify({ done: res }));
}
