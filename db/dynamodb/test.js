//const config = require("./config");
const query = require("./query");

async function test() {
  const users = await query.getUsers();
  console.log("Users: ", users);
  logBreak();

  const userByPk = await query.getUserByPk(users[0].pk);
  console.log("UserByPK: ", userByPk);
  logBreak();

  const userById = await query.getUserById(users[0].id);
  console.log("UserById: ", userById);
  logBreak();

  const calendars = await query.getCalendarsByUserPk(users[0].pk);
  console.log("CalendarsForUser: ", calendars);
  logBreak();

  const calendarByPk = await query.getCalendarByPk(calendars[0].id);
  console.log("CalendarByPk: ", calendarByPk);
  logBreak();

  const entries = await query.getEntriesByCalendarPk(calendars[0].id);
  console.log("Entries: ", entries);
  logBreak();

  const meals = await query.getMeals();
  console.log("Meals: ", meals);
  logBreak();

  const mealByPk = await query.getMealByPk(meals[0].pk);
  console.log("MealByPk: ", mealByPk);
  logBreak();

  const ingredientsByMeal = await query.getIngredientsByMealPk(meals[0].pk);
  console.log("IngredientsByMealPk: ", ingredientsByMeal);
  logBreak();

  const ingredientByPk = await query.getIngredientByPk(ingredientsByMeal[0].sk);
  console.log("IngredientByPk: ", ingredientByPk);
  logBreak();

  const imagesByMealPk = await query.getImagesByMealPk(meals[0].pk);
  console.log("ImagesByMealPk: ", imagesByMealPk);
  logBreak();
}
test();

function logBreak() {
  console.log("-----------------------------------" + "\n");
}
