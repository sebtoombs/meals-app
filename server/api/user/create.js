const argon2 = require("argon2");
const { create } = require("../../../db/dynamodb");
const to = require("../../../utils/to");
const uuidv1 = require("uuid/v1");

module.exports = async userData => {
  const hash = await argon2.hash("password"); //can error

  const pk = "User:" + uuidv1();

  const [createUserErr] = await to(
    create({
      tableName: "meals",
      data: {
        ...userData,
        pk,
        sk: "User",
        id: userData.email,
        password: hash
      }
    })
  );

  if (createUserErr) {
  }
};
