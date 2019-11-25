const config = require("./config");

function deleteItem({ tableName, by }) {
  var params = {
    TableName: tableName,
    Key: by
  };

  return config.docClient.delete(params);
}

module.exports = deleteItem;
