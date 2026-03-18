import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GraphService {
    constructor(private prisma: PrismaService) {}

    async getGraph() {
        const topics = await this.prisma.topic.findMany();
        const relations = await this.prisma.relation.findMany();

        const nodes = topics.map((t) => ({
            id: String(t.id),
            label: t.title,
            size: t.isCore ? 30 : 10,
        }));

        const edges = relations.map((r) => ({
            id: String(r.id),
            source: String(r.sourceId),
            target: String(r.targetId),
            // type: r.type,
        }));

        return { nodes, edges };
    }

    async getGraphByTopic(id: number) {
        const topic = await this.prisma.topic.findUnique({
            where: { id },
            include: {
                sourceRelations: {
                    include: { target: true },
                },
                targetRelations: {
                    include: { source: true },
                }
            },
        })

        if (!topic) {
            throw new NotFoundException(`Topic with id ${id} not found`);
        }

        const outgoing = topic.sourceRelations.map(r => ({
            id: r.target.id,
            title: r.target.title,
            type: r.type
        }))

        const incoming = topic.targetRelations.map(r => ({
            id: r.source.id,
            title: r.source.title,
            type: r.type
        }))
        
        return {
            center: {
                id: topic.id,
                title: topic.title
            },
            outgoing,
            incoming
        }
    }

    /* добавить
    
    поиск связей 
    соседние темы GET /topics/1/neighbors
    добавление новой связи POST /relations
    
    */
}
