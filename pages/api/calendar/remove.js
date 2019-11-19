const db = require("../../../lib/db");
const escape = require("sql-template-strings");
const to = require("../../../utils/to");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "method not allowed" });
  }
  let entry_id = req.body.id;

  //TODO validation?

  let query = escape`DELETE FROM calendar WHERE id = ${entry_id}`;
  const [queryErr, result] = await to(db.query(query));

  if (queryErr) {
    return res.status(500).json(queryErr);
  }

  res.status(200).json({});
};
