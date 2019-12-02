const { format } = require("date-fns");

const config = require("../config");
const _defaultParams = {
  TableName: "meals"
};

// ---------
// Helpers

function _getByKey(pk, sk) {
  if (Array.isArray(pk)) {
    return _batchGetByKey(pk, sk);
  }
  let params = {
    ..._defaultParams,
    Key: {
      pk: pk,
      sk: sk
    }
  };

  return config.docClient
    .get(params)
    .promise()
    .then(resp => resp.Item);
}

function _batchGetByKey(pks, sk) {
  const Keys = pks.map(pk => {
    return { pk, sk };
  });

  const tableName = _defaultParams.TableName;

  let params = {};
  params.RequestItems = {};
  params.RequestItems[tableName] = { Keys };

  return config.docClient
    .batchGet(params)
    .promise()
    .then(resp => resp.Responses)
    .then(responses => {
      if (typeof responses[tableName] !== "undefined")
        return responses[tableName];
      return null;
    });
}

function _queryByKey(key, keyValue, isSingle = false) {
  let params = {
    ..._defaultParams,
    KeyConditionExpression: "#keyName = :keyValue",
    ExpressionAttributeNames: {
      "#keyName": key
    },
    ExpressionAttributeValues: {
      ":keyValue": keyValue
    }
  };
  if (key === "sk") {
    params.IndexName = "gsi1";
  }

  return config.docClient
    .query(params)
    .promise()
    .then(resp => resp.Items)
    .then(items => (items && items.length > 1 && isSingle ? items[0] : items));
}

//---------------
// Entity Specific Accessors

/**
 * Get all users
 *
 * @return [Users]
 */
function getUsers() {
  return _queryByKey("sk", "User");
}

/**
 * Get user by primary key
 *
 * @param {S} pk
 * @return {User}
 */
function getUserByPk(pk) {
  return _getByKey(pk, "User");
}

/**
 * Get user by Identifier
 * Id might be: email, auth id (from strategy) etc
 *
 * @param {S} id
 */
function getUserById(id) {
  const params = {
    ..._defaultParams,
    IndexName: "gsi1",
    KeyConditionExpression: "sk = :sk AND id = :id",
    ExpressionAttributeValues: {
      ":sk": "User",
      ":id": id
    }
  };

  return config.docClient
    .query(params)
    .promise()
    .then(resp => resp.Items)
    .then(items => (items && items.length >= 1 ? items[0] : items));
}

//Fetch calendars for a given user PK
function getCalendarsByUserPk(pk) {
  const params = {
    ..._defaultParams,
    KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
    ExpressionAttributeValues: {
      ":pk": pk,
      ":sk": "Calendar:"
    }
  };

  return config.docClient
    .query(params)
    .promise()
    .then(resp => resp.Items);
}

//Get calendar by PK
function getCalendarByPk(pk) {
  return _getByKey(pk, "Calendar");
}

//Get entries for calendar
function getEntriesByCalendarPk(pk) {
  const today = format(new Date(), "yyyy-MM-dd");

  const params = {
    ..._defaultParams,
    KeyConditionExpression: "pk = :pk and sk between :sk2 and :sk",
    ExpressionAttributeValues: {
      ":pk": pk,
      ":sk": "Date:" + today,
      ":sk2": "Date:"
    }
  };

  return config.docClient
    .query(params)
    .promise()
    .then(resp => resp.Items);
}

//Get all meals
function getMeals() {
  return _queryByKey("sk", "Meal");
}

//Get meal by pk
function getMealByPk(pk) {
  return _getByKey(pk, "Meal");
}

//Get ingredients by meal
function getIngredientsByMealPk(pk) {
  const params = {
    ..._defaultParams,
    KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
    ExpressionAttributeValues: {
      ":pk": pk,
      ":sk": "Ingredient:"
    }
  };

  return config.docClient
    .query(params)
    .promise()
    .then(resp => resp.Items);
}

//Get ingredients by name
function getIngredientsByName(name) {
  const params = {
    ..._defaultParams,
    IndexName: "gsi1",
    KeyConditionExpression: "sk = :sk AND id = :id",
    ExpressionAttributeValues: {
      ":sk": "Ingredient",
      ":id": name
    }
  };

  return config.docClient
    .query(params)
    .promise()
    .then(resp => resp.Items)
    .then(items => (items && items.length >= 1 ? items[0] : items));
}

//get ingredient by pk
function getIngredientByPk(pk) {
  return _getByKey(pk, "Ingredient");
}

//get images by meal pk
function getImagesByMealPk(pk) {
  const params = {
    ..._defaultParams,
    KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
    ExpressionAttributeValues: {
      ":pk": pk,
      ":sk": "Image:"
    }
  };

  return config.docClient
    .query(params)
    .promise()
    .then(resp => resp.Items);
}

module.exports = {
  getUsers,
  getUserByPk,
  getUserById,
  getCalendarsByUserPk,
  getCalendarByPk,
  getEntriesByCalendarPk,
  getMeals,
  getMealByPk,
  getIngredientsByMealPk,
  getIngredientsByName,
  getIngredientByPk,
  getImagesByMealPk
};
