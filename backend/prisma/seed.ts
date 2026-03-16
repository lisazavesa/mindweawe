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
      { title: "Backend Development", isCore: true, domain: "backend", difficulty: 1 },
      { title: "JavaScript", domain: "backend", difficulty: 1 },
      { title: "TypeScript", domain: "backend", difficulty: 1 },
      { title: "Node.js", domain: "backend", difficulty: 1 },
      { title: "NestJS", domain: "backend", difficulty: 2 },
      { title: "Express", domain: "backend", difficulty: 1 },
      { title: "Databases", domain: "backend", difficulty: 1 },
      { title: "PostgreSQL", domain: "backend", difficulty: 1 },

      // Frontend
      { title: "Frontend Development", isCore: true, domain: "frontend", difficulty: 1 },
      { title: "HTML", domain: "frontend", difficulty: 1 },
      { title: "CSS", domain: "frontend", difficulty: 1 },
      { title: "React", domain: "frontend", difficulty: 2 },
      { title: "Vue.js", domain: "frontend", difficulty: 2 },
      { title: "TypeScript (Frontend)", domain: "frontend", difficulty: 1 },
      { title: "Webpack", domain: "frontend", difficulty: 2 },

      // Shared / Overlaps
      { title: "HTTP", domain: "shared", difficulty: 1 },
      { title: "REST API", domain: "shared", difficulty: 1 },
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
    ]
  })

  console.log("🌱 Large graph with frontend seed completed")
}

main().finally(() => prisma.$disconnect())