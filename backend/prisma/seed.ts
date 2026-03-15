import "dotenv/config"

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const javascript = await prisma.topic.create({
    data: {
      title: "JavaScript",
      description: "Основной язык веб-разработки",
    },
  })

  const node = await prisma.topic.create({
    data: {
      title: "Node.js",
      description: "Runtime для запуска JS на сервере",
    },
  })

  const nest = await prisma.topic.create({
    data: {
      title: "NestJS",
      description: "Backend framework для Node.js",
    },
  })

  const docker = await prisma.topic.create({
    data: {
      title: "Docker",
      description: "Контейнеризация приложений",
    },
  })

  const postgres = await prisma.topic.create({
    data: {
      title: "PostgreSQL",
      description: "Реляционная база данных",
    },
  })

  await prisma.relation.createMany({
    data: [
      { sourceId: javascript.id, targetId: node.id },
      { sourceId: node.id, targetId: nest.id },
      { sourceId: nest.id, targetId: docker.id },
      { sourceId: node.id, targetId: postgres.id },
    ],
  })

  console.log("🌱 Seed completed")
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })