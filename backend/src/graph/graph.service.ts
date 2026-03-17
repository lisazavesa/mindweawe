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

    /* добавить
    
    поиск связей 
    соседние темы GET /topics/1/neighbors
    добавление новой связи POST /relations
    
    */
}
