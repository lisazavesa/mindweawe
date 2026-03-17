import "dotenv/config"
import { PrismaClient, RelationType } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.relation.deleteMany()
  await prisma.topic.deleteMany()

  const topics = await prisma.topic.createManyAndReturn({
    data: [
      // Backend
      { title: "Backend Development", isCore: true, domain: "backend", difficulty: 1, description: "Серверная разработка" },
      { title: "JavaScript", domain: "shared", difficulty: 1, description: "Основной язык веб-разработки" },
      { title: "TypeScript", domain: "shared", difficulty: 1, description: "Типизированный JavaScript" },
      { title: "Node.js", domain: "backend", difficulty: 1, description: "Runtime для серверного JS" },
      { title: "NestJS", domain: "backend", difficulty: 2, description: "Архитектурный backend-фреймворк" },
      { title: "Express", domain: "backend", difficulty: 1, description: "Минималистичный backend-фреймворк" },
      { title: "Databases", domain: "backend", difficulty: 1, description: "Базы данных" },
      { title: "PostgreSQL", domain: "backend", difficulty: 1, description: "Реляционная база данных" },

      // Frontend
      { title: "Frontend Development", isCore: true, domain: "frontend", difficulty: 1, description: "Клиентская разработка" },
      { title: "HTML", domain: "frontend", difficulty: 1, description: "Разметка" },
      { title: "CSS", domain: "frontend", difficulty: 1, description: "Стили" },
      { title: "React", domain: "frontend", difficulty: 2, description: "UI библиотека" },
      { title: "Vue.js", domain: "frontend", difficulty: 2, description: "UI фреймворк" },

      // Shared
      { title: "HTTP", domain: "shared", difficulty: 1, description: "Протокол веба" },
      { title: "REST API", domain: "shared", difficulty: 1, description: "Архитектура API" },
      { title: "GraphQL", domain: "shared", difficulty: 2, description: "Альтернатива REST" },
      { title: "WebSockets", domain: "shared", difficulty: 2, description: "Реальное время" },
    ]
  })

  const map = Object.fromEntries(topics.map(t => [t.title, t.id]))

  await prisma.relation.createMany({
  data: [
    // 🔴 CORE входы
    { sourceId: map["JavaScript"], targetId: map["Backend Development"], type: RelationType.NECESSARY },
    { sourceId: map["JavaScript"], targetId: map["Frontend Development"], type: RelationType.NECESSARY },

    // 🔴 Backend путь
    { sourceId: map["Backend Development"], targetId: map["Node.js"], type: RelationType.NECESSARY },
    { sourceId: map["Node.js"], targetId: map["Express"], type: RelationType.NECESSARY },
    { sourceId: map["Node.js"], targetId: map["NestJS"], type: RelationType.RECOMMENDED },

    { sourceId: map["Backend Development"], targetId: map["Databases"], type: RelationType.NECESSARY },
    { sourceId: map["Databases"], targetId: map["PostgreSQL"], type: RelationType.NECESSARY },

    { sourceId: map["Backend Development"], targetId: map["HTTP"], type: RelationType.NECESSARY },
    { sourceId: map["HTTP"], targetId: map["REST API"], type: RelationType.NECESSARY },
    { sourceId: map["HTTP"], targetId: map["GraphQL"], type: RelationType.RECOMMENDED },

    { sourceId: map["Backend Development"], targetId: map["WebSockets"], type: RelationType.RECOMMENDED },

    // 🔴 Frontend путь
    { sourceId: map["Frontend Development"], targetId: map["HTML"], type: RelationType.NECESSARY },
    { sourceId: map["Frontend Development"], targetId: map["CSS"], type: RelationType.NECESSARY },
    { sourceId: map["Frontend Development"], targetId: map["React"], type: RelationType.RECOMMENDED },
    { sourceId: map["Frontend Development"], targetId: map["Vue.js"], type: RelationType.RECOMMENDED },

    // 🟡 Связи (экосистема)
    { sourceId: map["TypeScript"], targetId: map["Node.js"], type: RelationType.RECOMMENDED },
    { sourceId: map["TypeScript"], targetId: map["React"], type: RelationType.RECOMMENDED },

    { sourceId: map["REST API"], targetId: map["Node.js"], type: RelationType.RELATED },
    { sourceId: map["GraphQL"], targetId: map["Node.js"], type: RelationType.RELATED },
    { sourceId: map["WebSockets"], targetId: map["Node.js"], type: RelationType.RELATED },
  ]
})

  console.log("🌱 Real-world graph seed completed")
}

main().finally(() => prisma.$disconnect())