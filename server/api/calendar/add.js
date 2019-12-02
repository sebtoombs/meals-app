const db = require("../../../db/dynamodb");
const { format, parse } = require("date-fns");
const to = require("../../../utils/to");

const addEntry = async ctx => {
  let meal_pk = ctx.request.body.meal_pk;
  let date = parse(ctx.request.body.date, "yyyy-MM-dd", new Date());

  //TODO validation

  await db.create({
    TableName: "meals",
    data: {}
  });
};
module.exports = addEntry;
