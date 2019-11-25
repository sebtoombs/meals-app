/**
 *
 * @param {*} param0
 *
 * by: should be kv (can be multiple) e.g. {id: 1} or {name: "Thing", type: "thingtype"}
 */

const diff = require("deep-diff");
const _ = require("lodash");

const config = require("./config");

function update({ tableName, by, original, updated }) {
  const updateExpression = getUpdateExpression(original, updated);

  var params = {
    TableName: tableName,
    Key: by,
    UpdateExpression: updateExpression.UpdateExpression,
    ExpressionAttributeValues: updateExpression.ExpressionAttributeValues,
    ReturnValues: "UPDATED_NEW"
  };

  return config.docClient.update(params);
}

module.exports = update;

function getUpdateExpression(original, updated) {
  const diffs = diff.diff(original, updated);

  let UpdateExpression = "set ";
  let ExpressionAttributeValues = {};
  diffs.map(d => {
    const path = d.path.join(".");
    if (d.kind === "E" || d.kind === "N") {
      UpdateExpression += path + " = :" + path + " ";
      ExpressionAttributeValues[":" + path] = d.rhs;
    } else if (d.kind === "A") {
      UpdateExpression += path + " = :" + path + " ";
      ExpressionAttributeValues[":" + path] = _.get(updated, path);
    }
  });

  return { UpdateExpression, ExpressionAttributeValues };
}
