const uuidv1 = require("uuid/v1");
const db = require("../../../db/dynamodb");
const slugify = require("slugify");

const createMeal = async ctx => {
  const { name = null, name_extra = null } = ctx.request.body;
  const pk = "Meal:" + uuidv1();
  const id = slugify(name);

  let data = {
    pk,
    sk: "Meal",
    name,
    id
  };
  if (name_extra) {
    data.name_extra = name_extra;
  }

  await db.create({
    tableName: "meals",
    data: data
  });

  ctx.body = { pk };
};
module.exports = createMeal;
