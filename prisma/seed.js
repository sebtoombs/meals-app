const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const seb = await prisma.user.upsert({
    where: { email: "sebtoombs@gmail.com" },
    update: {},
    create: {
      email: `sebtoombs@gmail.com`,
      name: "Seb",
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
