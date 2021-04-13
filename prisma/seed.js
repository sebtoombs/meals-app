const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { startOfDay, addDays } = require("date-fns");

async function main() {
  const seb = await prisma.user.upsert({
    where: { email: "sebtoombs@gmail.com" },
    update: {},
    create: {
      email: `sebtoombs@gmail.com`,
      name: "Seb",
    },
  });

  const mealSpaghetti = await prisma.meal.create({
    data: {
      name: "Spaghetti",
    },
  });

  const mealPizza = await prisma.meal.create({
    data: {
      name: "Pizza",
    },
  });

  const entryToday = await prisma.calendarEntry.create({
    data: {
      mealId: mealSpaghetti.id,
      date: addDays(startOfDay(new Date()), 1),
    },
  });

  const entryTomorrow = await prisma.calendarEntry.create({
    data: {
      mealId: mealPizza.id,
      date: addDays(startOfDay(new Date()), 2),
    },
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
