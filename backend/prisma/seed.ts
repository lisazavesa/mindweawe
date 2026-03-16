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
      { title: "Backend Development", isCore: true, domain: "backend", difficulty: 1, description: "Общее введение в серверную разработку" },
      { title: "JavaScript", domain: "backend", difficulty: 1, description: "Основной язык для backend на Node.js" },
      { title: "TypeScript", domain: "backend", difficulty: 1, description: "Статическая типизация для JavaScript" },
      { title: "Node.js", domain: "backend", difficulty: 1, description: "Серверный runtime для JavaScript" },
      { title: "NestJS", domain: "backend", difficulty: 2, description: "Фреймворк для построения масштабируемого backend" },
      { title: "Express", domain: "backend", difficulty: 1, description: "Минималистичный web-фреймворк для Node.js" },
      { title: "Databases", domain: "backend", difficulty: 1, description: "Основы работы с базами данных" },
      { title: "PostgreSQL", domain: "backend", difficulty: 1, description: "Популярная реляционная база данных" },

      // Frontend
      { title: "Frontend Development", isCore: true, domain: "frontend", difficulty: 1, description: "Общее введение во фронтенд" },
      { title: "HTML", domain: "frontend", difficulty: 1, description: "Язык разметки веб-страниц" },
      { title: "CSS", domain: "frontend", difficulty: 1, description: "Каскадные таблицы стилей для веба" },
      { title: "React", domain: "frontend", difficulty: 2, description: "Библиотека для построения UI" },
      { title: "Vue.js", domain: "frontend", difficulty: 2, description: "Прогрессивный фреймворк для UI" },
      { title: "TypeScript (Frontend)", domain: "frontend", difficulty: 1, description: "TypeScript для фронтенд проектов" },
      { title: "Webpack", domain: "frontend", difficulty: 2, description: "Сборщик модулей для фронтенда" },

      // Shared / Overlaps
      { title: "HTTP", domain: "shared", difficulty: 1, description: "Протокол передачи данных в интернете" },
      { title: "REST API", domain: "shared", difficulty: 1, description: "Стиль архитектуры веб-сервисов" },
      { title: "GraphQL", domain: "shared", difficulty: 2, description: "Запросы данных с гибкой схемой" },
      { title: "WebSockets", domain: "shared", difficulty: 2, description: "Двусторонняя связь между клиентом и сервером" },
    ]
  })

  const map = Object.fromEntries(topics.map(t => [t.title, t.id]))

  await prisma.relation.createMany({
    data: [
      // Backend relations
      { sourceId: map["Backend Development"], targetId: map["JavaScript"], type: RelationType.NECESSARY },
      { sourceId: map["JavaScript"], targetId: map["TypeScript"], type: RelationType.RECOMMENDED },
      { sourceId: map["JavaScript"], targetId: map["Node.js"], type: RelationType.NECESSARY },
      { sourceId: map["Node.js"], targetId: map["Express"], type: RelationType.NECESSARY },
      { sourceId: map["Node.js"], targetId: map["NestJS"], type: RelationType.RECOMMENDED },
      { sourceId: map["Backend Development"], targetId: map["Databases"], type: RelationType.NECESSARY },
      { sourceId: map["Databases"], targetId: map["PostgreSQL"], type: RelationType.NECESSARY },

      // Frontend relations
      { sourceId: map["Frontend Development"], targetId: map["HTML"], type: RelationType.NECESSARY },
      { sourceId: map["Frontend Development"], targetId: map["CSS"], type: RelationType.NECESSARY },
      { sourceId: map["Frontend Development"], targetId: map["React"], type: RelationType.NECESSARY },
      { sourceId: map["Frontend Development"], targetId: map["Vue.js"], type: RelationType.RECOMMENDED },
      { sourceId: map["Frontend Development"], targetId: map["TypeScript (Frontend)"], type: RelationType.RECOMMENDED },
      { sourceId: map["Frontend Development"], targetId: map["Webpack"], type: RelationType.RECOMMENDED },

      // Shared / Overlaps
      { sourceId: map["JavaScript"], targetId: map["HTTP"], type: RelationType.NECESSARY },
      { sourceId: map["React"], targetId: map["HTTP"], type: RelationType.RECOMMENDED },
      { sourceId: map["TypeScript"], targetId: map["TypeScript (Frontend)"], type: RelationType.RECOMMENDED },
      { sourceId: map["REST API"], targetId: map["HTTP"], type: RelationType.NECESSARY },
      { sourceId: map["REST API"], targetId: map["GraphQL"], type: RelationType.RECOMMENDED },
      { sourceId: map["REST API"], targetId: map["WebSockets"], type: RelationType.RECOMMENDED },
    ]
  })

  console.log("🌱 Expanded graph with frontend & descriptions seed completed")
}

main().finally(() => prisma.$disconnect())