const db = require("../../../lib/db");
const escape = require("sql-template-strings");
const qs = require("qs");
const { format, startOfToday, startOfTomorrow } = require("date-fns");

module.exports = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const qsParsed = qs.parse(req.query, { allowDots: true });
  const filter = qsParsed.filter ? qsParsed.filter : null;

  let query = escape`SELECT * FROM calendar`;

  let where = [];
  //let index = 0;
  for (let key in filter) {
    if (!filter.hasOwnProperty(key)) continue;

    let operator = "=";
    let value = null;
    if (typeof filter[key] === "object") {
      let filterKey = Object.keys(filter[key])[0];
      switch (filterKey) {
        case "gte": {
          operator = ">=";
          break;
        }
        case "gt": {
          operator = ">";
          break;
        }
        case "lte": {
          operator = "<=";
          break;
        }
        case "lt": {
          operator = "<";
          break;
        }
      }

      value = filter[key][filterKey];
    } else {
      value = "=" + filter[key];
    }

    if (key === "date") {
      switch (value) {
        case "today": {
          let today = format(startOfToday(), "yyyy-MM-dd");
          value = today;
          break;
        }
        case "tomorrow": {
          let tomorrow = format(startOfTomorrow(), "yyyy-MM-dd");
          value = tomorrow;
          break;
        }
      }
    }

    //where += operator + '"' + value + '"';

    where.push({ key, value, operator });

    //if (index < Object.keys(filter).length - 1) where += " AND ";
    //index++;
  }

  //console.log("Where: ", where);

  if (where.length > 0) query.append(escape` WHERE `);
  where.map(w => {
    query.append(w.key + w.operator + '"' + w.value + '"');
  });

  if (page < 1) page = 1;

  query.append(escape` ORDER BY date`);
  query.append(escape` LIMIT ${(page - 1) * limit}, ${limit}`);
  //console.log("Query: ", query.text);
  //console.log("Values: ", query.values);

  //query.append(escape` JOIN meals on calendar.meal_id=meals.id as meal`);

  let calendar = await db.query(query);

  //Get meals
  let meal_ids = calendar.map(entry => entry.meal_id);
  meal_ids = [...new Set(meal_ids)];

  const mealQuery = escape`SELECT * FROM meals WHERE id IN(${meal_ids})`;
  const meals = await db.query(mealQuery);
  //Add meals to calendar entries & format date
  calendar = calendar.map(entry => {
    entry.date = format(entry.date, "yyyy-MM-dd");

    const entryMeal = meals.find(meal => meal.id === entry.meal_id);
    entry.meal = entryMeal;
    return entry;
  });

  const count = await db.query(escape`
      SELECT COUNT(*)
      AS calendarCount
      FROM calendar
    `);

  const { calendarCount } = count[0];
  const pageCount = Math.ceil(calendarCount / limit);
  res.status(200).json({ calendar, pageCount, page });
  return;
};
