const config = require("./config");
const create = require("./create");
const uuidv1 = require("uuid/v1");
const { format } = require("date-fns");

const userId = "User:" + uuidv1();
const calendarId = "Calendar:" + uuidv1();
const mealId1 = "Meal:" + uuidv1();

console.log("user PK", userId);

const ingredientId1 = "Ingredient:" + uuidv1();

const imageId1 = "Image:" + uuidv1();

const today = format(new Date(), "yyyy-MM-dd");

const seedData = [
  //User
  {
    pk: userId,
    sk: "User",
    id: "sebtoombs@gmail.com",
    email: "sebtoombs@gmail.com"
  },
  //Calendar
  {
    pk: calendarId,
    sk: "Calendar",
    id: "Default"
  },
  //Add calendar to user
  {
    pk: userId,
    sk: calendarId,
    id: calendarId
  },
  //Add meal (no owner)
  {
    pk: mealId1,
    sk: "Meal",
    id: "turmeric-pepper-roast-chicken",
    name: "Turmeric Pepper Roast Chicken",
    name_extra: "with Asparagus, Almond & Quinoa"
  },
  //Add ingredient
  {
    pk: ingredientId1,
    sk: "Ingredient",
    name: "Chicken Breast"
  },
  //Add ingredient to meal
  {
    pk: mealId1,
    sk: ingredientId1,
    qty: 500,
    unit: "grams"
  },
  //Add entry to calendar
  {
    pk: calendarId,
    sk: "Date:" + today,
    id: mealId1
  },
  //Add "image" to meal
  {
    pk: mealId1,
    sk: imageId1,
    src: "https://example.com/image.jpg",
    width: "640",
    height: "480"
  }
];

async function seed() {
  seedData.forEach(async entry => {
    await create({ tableName: "meals", data: entry });
  });

  console.log("done");
}
seed();
