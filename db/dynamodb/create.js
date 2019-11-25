const config = require("./config");

const uuidv1 = require("uuid/v1");

function create({ tableName, data }) {
  /*if (typeof data.id === "undefined") {
    data.id = uuidv1();
  }*/

  var params = {
    TableName: tableName,
    Item: data
  };

  return config.docClient.put(params).promise();
}
module.exports = create;
