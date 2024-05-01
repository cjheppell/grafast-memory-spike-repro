// @ts-check
import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";

export const MyPlugin = makeExtendSchemaPlugin((build) => {
  const { user_config } = build.input.pgRegistry.pgResources;
  const {
    dataplanPg: { TYPES },
    sql,
  } = build;

  return {
    typeDefs: gql`
      extend type User {
        totalLanguages: Int
      }
    `,
    plans: {
      User: {
        totalLanguages($user) {
          const $configs = user_config.find({ user_id: $user.get("id") });
          // Currently @dataplan/pg marks `.clone()` as private (unsure why),
          // but it's the easiest way if you're not dealing with a connection
          // to take an existing PgSelectStep and turn it into a PgSelectStep
          // in aggregate mode.
          /** @type {any} */
          const $configs2 = $configs;
          /** @type {import("@dataplan/pg").PgSelectStep} */
          const $agg = $configs2.clone("aggregate");
          return $agg.single().select(sql`count(*)`, TYPES.bigint);
        },
      },
    },
  };
});
