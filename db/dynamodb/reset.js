const config = require("./config");
const install = require("./install");

var params = {
  TableName: "meals"
};

async function reset() {
  //Drop table
  await config.dynamodb.deleteTable(params).promise();

  //Create table
  await install();

  console.log("done");
}
reset();
