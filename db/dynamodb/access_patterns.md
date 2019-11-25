- getMeals
- getMealsByUser?
- getIngredientsByName
- getIngredientsByMeal
- getMealsOnCalendarsByUserByDate
- getUserBy(something)

## Table

loginIdentifier might be email, might be something else (eg githubid) depending on auth strategy

| PK                   | SK (gsi1 PK) | Data (gsi1 SK)          | [...attributes]          |
| -------------------- | ------------ | ----------------------- | ------------------------ |
| &lt;userId&gt;       | user         | &lt;loginIdentifier&gt; | ...                      |
| &lt;calendarId&gt;   | calendar     | &lt;calendarName&gt;    | ...                      |
| &lt;userId&gt;       | calendar:1   | &lt;calendarId&gt;      | ...                      |
| &lt;calendarId&gt;   | date         | mealId                  | {meal: &lt;mealId&gt;, } |
| &lt;mealId&gt;       | meal         | &lt;mealName&gt;        | {name?, userId:?}        |
| &lt;userId&gt;       | meal:1       |                         |                          |
| &lt;ingredientId&gt; | ingredient   | &lt;ing.Name&gt;        |                          |
| &lt;mealId&gt;       | ingredient:1 | ???                     | {qty, unit}              |
| &lt;mealId&gt;       | image:1      | ???                     | {...imageData}           |

## Access Table

| Access method           | Query                                      |
| ----------------------- | ------------------------------------------ |
| getUsers                | use GSI, PK = user                         |
| getUserByID             | PK = userId                                |
| getUserByLoginIdentfier | use GSI PK = user, SK = loginIdentifier    |
| getCalendarsByUser      | PK = userId, SK begins_with "calendar:"    |
| getEntriesByCalendar    | PK = calendarId, SK begins_with "entry:"   |
| getMeals                | use GSI, PK = meal                         |
| getMealsByUser?         | PK = userId, SK begins_with "meal:"        |
| getIngredientsByMeal    | PK = mealId, SK begins_with "ingredient: " |
| getIngredientsByName    | use GSI, PK = ingredient, SK = name        |
| getImagesByMeal         | PK = mealId, SK begins_with "image:"       |
