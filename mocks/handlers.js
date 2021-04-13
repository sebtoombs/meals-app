import { graphql as graphqlRequest, buildSchema } from "graphql";
import { graphql, rest } from "msw";

// const handlers = [
//   graphql.query("GetAllUsers", (req, res, ctx) => {
//     return res(
//       ctx.data({
//         users: [
//           {
//             firstName: "John",
//             lastName: "Maverick",
//           },
//           {
//             firstName: "Cathaline",
//             lastName: "McCoy",
//           },
//         ],
//       })
//     );
//   }),
//   rest.get("/login", async (req, res, ctx) => {
//     // const user = await users.login(JSON.parse(req.body));
//     return res(ctx.json({ user: 0 }));
//   }),
//   rest.get("/api/checkout", async (req, res, ctx) => {
//     // const user = await users.login(JSON.parse(req.body));
//     // const isAuthorized = user.authorize(req.headers.Authorization);
//     // if (!isAuthorized) {
//     //   return res(ctx.status(401), ctx.json({ message: "Not authorized" }));
//     // }
//     // const shoppingCart = JSON.parse(req.body);
//     // // do whatever other things you need to do with this shopping cart
//     return res(ctx.json({ success: true }));
//   }),
// ];
// export { handlers };

// const schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

import {
  asNexusMethod,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  stringArg,
  intArg,
  booleanArg,
} from "nexus";

import { GraphQLDate } from "graphql-iso-date";

export const GQLDate = asNexusMethod(GraphQLDate, "date");

const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("email");
    t.list.field("families", {
      type: "Family",
    });
  },
});

const Family = objectType({
  name: "Family",
  definition(t) {
    t.int("id");
    t.string("name");
    t.list.field("members", {
      type: "User",
    });
  },
});

const CalendarEntry = objectType({
  name: "CalendarEntry",
  definition(t) {
    t.int("id");
    t.date("date");
    t.field("meal", {
      type: "Meal",
    });
  },
});

const Meal = objectType({
  name: "Meal",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("description");
  },
});

const CalendarDayEntry = objectType({
  name: "CalendarDayEntry",
  definition(t) {
    t.date("date");
    t.list.field("entries", {
      type: "CalendarEntry",
    });
  },
});

const Query = objectType({
  name: "Query",
  definition(t) {
    t.list.field("calendar", {
      type: "CalendarDayEntry",
      args: {
        includeEmpty: booleanArg(),
        startDate: GQLDate,
        days: intArg(),
      },
    });
    t.list.field("meals", {
      type: "Meal",
    });
    t.field("meal", {
      type: "Meal",
      args: {
        mealId: nonNull(intArg()),
      },
    });
  },
});

const schema = makeSchema({
  types: [Query, CalendarEntry, CalendarDayEntry, Meal, GQLDate],
});

const root = {
  calendar: () => {
    return [
      {
        id: 1,
        meal: {
          id: 1,
          name: "Pizza",
        },
      },
    ];
  },
};
const handlers = [
  graphql.operation(async (req, res, ctx) => {
    const payload = await graphqlRequest(
      schema,
      req.body.query,
      root,
      null,
      req.variables
    );
    return res(ctx.data(payload.data), ctx.errors(payload.errors));
  }),
];

export { handlers };
