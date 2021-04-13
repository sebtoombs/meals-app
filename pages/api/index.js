import { ApolloServer } from "apollo-server-micro";
import {
  startOfDay,
  format,
  addDays,
  endOfDay,
  formatISO,
  parseISO,
  parse,
} from "date-fns";
import { GraphQLDate } from "graphql-iso-date";
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
import path from "path";
import prisma from "../../lib/prisma";

export const GQLDate = asNexusMethod(GraphQLDate, "date");

const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("email");
    t.list.field("families", {
      type: "Family",
      resolve: (parent) =>
        prisma.user
          .findUnique({
            where: {
              id: { in: Number(parent.id) },
            },
          })
          .families(),
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
      resolve: (parent) =>
        prisma.family
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .members(),
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
      resolve: (parent) => {
        return prisma.meal.findUnique({
          where: { id: Number(parent.mealId) },
        });
      },
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
      resolve: (parent) => {
        // Resolving like this is pretty inefficient
        const entryIds = parent.entries.map((entry) => entry.id);

        return prisma.calendarEntry.findMany({
          where: { id: { in: entryIds } },
        });
      },
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
      resolve: async (_, args) => {
        // TODO accept TZ or startdate from client here
        args.days = args.days || 14;
        const startDate = startOfDay(args.startDate || new Date());
        const endDate = endOfDay(addDays(startDate, args.days));

        // Get entries within the fortnight
        const entries = await prisma.calendarEntry.findMany({
          where: {
            AND: [
              {
                date: {
                  gt: startDate,
                },
              },
              {
                date: {
                  lte: endDate,
                },
              },
            ],
          },
          orderBy: [{ date: "asc" }],
        });

        // const entriesByDate = new Array(args.days).fill().map(_,i)

        // Collect by date
        const entriesByDate = entries.reduce((obj, entry) => {
          const dateFmt = format(entry.date, "yyyy-MM-dd");

          if (typeof obj[dateFmt] === "undefined")
            obj[dateFmt] = {
              // date: parse(dateFmt, "yyyy-MM-dd", entry.date),
              date: dateFmt,
              entries: [],
            };

          obj[dateFmt].entries.push(entry);
          return obj;
        }, {});

        // Insert missing days if required
        if (args.includeEmpty) {
          const lastEntry = Object.keys(entriesByDate)[
            Object.keys(entriesByDate).length - 1
          ];
          new Array(args.days).fill().map((_, i) => {
            const date = startOfDay(addDays(startDate, i));
            const key = format(date, "yyyy-MM-dd");
            if (typeof entriesByDate[key] === "undefined" && key < lastEntry) {
              entriesByDate[key] = { date: key, entries: [] };
            }
          });
        }

        return Object.values(entriesByDate).sort((a, b) => {
          if (a.date < b.date) return -1;
          if (a.date > b.date) return 1;
          return 0;
        });
      },
    });
    t.list.field("meals", {
      type: "Meal",
      resolve: async (_, args) => prisma.meal.findMany(),
    });
    t.field("meal", {
      type: "Meal",
      args: {
        mealId: nonNull(intArg()),
      },
      resolve: (_, args) => {
        return prisma.meal.findUnique({
          where: { id: Number(args.mealId) },
        });
      },
    });
    // t.field("post", {
    //   type: "Post",
    //   args: {
    //     postId: nonNull(stringArg()),
    //   },
    //   resolve: (_, args) => {
    //     return prisma.post.findUnique({
    //       where: { id: Number(args.postId) },
    //     });
    //   },
    // });
    // t.list.field("feed", {
    //   type: "Post",
    //   resolve: (_parent, _args) => {
    //     return prisma.post.findMany({
    //       where: { published: true },
    //     });
    //   },
    // });
    // t.list.field("drafts", {
    //   type: "Post",
    //   resolve: (_parent, _args, ctx) => {
    //     return prisma.post.findMany({
    //       where: { published: false },
    //     });
    //   },
    // });
    // t.list.field("filterPosts", {
    //   type: "Post",
    //   args: {
    //     searchString: nullable(stringArg()),
    //   },
    //   resolve: (_, { searchString }, ctx) => {
    //     return prisma.post.findMany({
    //       where: {
    //         OR: [
    //           { title: { contains: searchString } },
    //           { content: { contains: searchString } },
    //         ],
    //       },
    //     });
    //   },
    // });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("addCalendarEntry", {
      type: "CalendarEntry",
      args: {
        mealId: intArg(),
        date: GQLDate,
      },
      resolve: (_, { mealId, date }, ctx) => {
        return prisma.calendarEntry.create({
          data: {
            date,
            mealId,
          },
        });
      },
    });

    t.field("removeCalendarEntry", {
      type: "CalendarEntry",
      args: {
        id: intArg(),
      },
      resolve: (_, { id }, ctx) => {
        return prisma.calendarEntry.delete({
          where: { id: Number(id) },
        });
      },
    });
  },
});

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    User,
    Family,
    CalendarEntry,
    Meal,
    GQLDate,
    CalendarDayEntry,
  ],
  outputs: {
    // typegen: path.join(process.cwd(), "pages/api/nexus-typegen.ts"),
    schema: path.join(process.cwd(), "pages/api/schema.graphql"),
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({
  schema,
  playground:
    process.env.NODE_ENV === "development"
      ? {
          endpoint: "/api",
        }
      : null,
}).createHandler({
  path: "/api",
});
