//https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.04.html

module.exports = {
  config: require("./config"),
  install: require("./install"),
  create: require("./create"),
  //get: require("./get"),
  query: require("./query"),
  update: require("./update"),
  delete: require("./delete")
};
