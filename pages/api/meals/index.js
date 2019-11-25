const db = require("../../../lib/db");
const escape = require("sql-template-strings");
const cloudinary = require("cloudinary").v2;

module.exports = (req, res) => {
  if (req.method === "GET") {
    return getMeals(req, res);
  } else if (req.method === "POST") {
    return createMeal(req, res);
  } else {
    return res.status(405).send("Method not allowed");
  }
};

const createMeal = async (req, res) => {
  console.log(req.body);
  return res.status(200).json({ message: "ok" });
};

const getMeals = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  if (page < 1) page = 1;
  const meals = await db.query(escape`
      SELECT *
      FROM meals
      ORDER BY id
      LIMIT ${(page - 1) * limit}, ${limit}
    `);
  const count = await db.query(escape`
      SELECT COUNT(*)
      AS mealsCount
      FROM meals
    `);

  const { mealsCount } = count[0];
  const pageCount = Math.ceil(mealsCount / limit);
  res.status(200).json({ meals, pageCount, page });
};
