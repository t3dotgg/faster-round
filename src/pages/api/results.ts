import { connect } from "@planetscale/database";
const RESULTS_QUERY =
  "select `roundest-mon`.Pokemon.id, aggr_selection_0_Vote._voteFor, aggr_selection_1_Vote._voteAgainst from `roundest-mon`.Pokemon left join (select `roundest-mon`.Vote.votedForId, count(*) as orderby_aggregator from `roundest-mon`.Vote group by `roundest-mon`.Vote.votedForId) as orderby_0_Vote on `roundest-mon`.Pokemon.id = orderby_0_Vote.votedForId left join (select `roundest-mon`.Vote.votedForId, count(*) as _voteFor from `roundest-mon`.Vote group by `roundest-mon`.Vote.votedForId) as aggr_selection_0_Vote on `roundest-mon`.Pokemon.id = aggr_selection_0_Vote.votedForId left join (select `roundest-mon`.Vote.votedAgainstId, count(*) as _voteAgainst from `roundest-mon`.Vote group by `roundest-mon`.Vote.votedAgainstId) as aggr_selection_1_Vote on `roundest-mon`.Pokemon.id = aggr_selection_1_Vote.votedAgainstId where 1 = 1 order by COALESCE(orderby_0_Vote.orderby_aggregator, ?) desc";

export const getSortedPokemon = async () => {
  const conn = connect({
    host: import.meta.env.DATABASE_HOST,
    username: import.meta.env.DATABASE_USERNAME,
    password: import.meta.env.DATABASE_PASSWORD,
  });
  return await conn.execute(RESULTS_QUERY, ["0", "1"]);
};
