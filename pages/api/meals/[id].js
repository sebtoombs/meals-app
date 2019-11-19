const db = require("../../../lib/db");
const escape = require("sql-template-strings");

module.exports = async (req, res) => {
  const [meal] = await db.query(escape`
    SELECT *
    FROM meals
    WHERE id = ${req.query.id}
  `);
  res.status(200).json({ meal });
};
