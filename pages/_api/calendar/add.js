const db = require("../../../lib/db");
const escape = require("sql-template-strings");
const { parse } = require("date-fns");
const to = require("../../../utils/to");
const { format } = require("date-fns");

module.exports = async (req, res) => {
  let meal_id = req.body.meal_id;
  let date = parse(req.body.date, "yyyy-MM-dd", new Date());

  //TODO validation

  let query = escape`INSERT INTO calendar (meal_id, date) VALUES (${meal_id}, ${date})`;
  const [insertErr, insert] = await to(db.query(query));

  if (insertErr) {
    return res.status(500).json(insertErr);
  }

  query = escape`SELECT * FROM calendar WHERE id = ${insert.insertId}`;
  const [selectErr, calendarResult] = await to(db.query(query));
  if (selectErr) {
    return res.status(500).json(selectErr);
  }

  let calendar = calendarResult[0];
  calendar.date = format(calendar.date, "yyyy-MM-dd");

  const [findMealErr, mealsResult] = await to(
    db.query(escape`SELECT * FROM meals WHERE id=${calendar.meal_id}`)
  );

  if (findMealErr) {
    return res.status(500).json(findMealErr);
  }

  calendar.meal = mealsResult[0];

  console.log("inserted ", calendarResult[0]);
  res.status(200).json(calendar);
};
