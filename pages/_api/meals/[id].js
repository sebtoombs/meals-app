//const db = require("../../../lib/db");
//const escape = require("sql-template-strings");

const { getMealByPk } = require("../../../db/dynamodb").query;

module.exports = async (req, res) => {
  /*const [meal] = await db.query(escape`
    SELECT *
    FROM meals
    WHERE id = ${req.query.id}
  `);
  res.status(200).json({ meal });*/

  const meal = await getMealByPk(req.query.id);
  res.status(200).json(meal);
};
