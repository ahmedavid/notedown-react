import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient({ log: ["query"] })
async function main() {
  const david = await prisma.user.upsert({
    where: { email: "ahmedavid@gmail.com" },
    update: {},
    create: {
      id: 8,
      email: "ahmedavid@gmail.com",
      name: "David",
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
