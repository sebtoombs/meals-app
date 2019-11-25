const config = require("./config");

function install() {
  var params = {
    TableName: "meals",
    KeySchema: [
      { AttributeName: "pk", KeyType: "HASH" }, //Partition key
      { AttributeName: "sk", KeyType: "RANGE" } //sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "sk", AttributeType: "S" },
      { AttributeName: "pk", AttributeType: "S" },
      { AttributeName: "id", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [
      {
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10
        },
        Projection: {
          // attributes to project into the index
          ProjectionType: "ALL" // (ALL | KEYS_ONLY | INCLUDE)
        },
        IndexName: "gsi1",
        KeySchema: [
          {
            AttributeName: "sk",
            KeyType: "HASH"
          },
          {
            AttributeName: "id",
            KeyType: "RANGE"
          }
        ]
      }
    ]
  };

  return config.dynamodb.createTable(params).promise();
}
module.exports = install;
