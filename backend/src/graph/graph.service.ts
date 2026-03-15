import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GraphService {
    constructor(private prisma: PrismaService) {}
    
    async getGraph() {
        const topics = await this.prisma.topic.findMany()
        const relations = await this.prisma.relation.findMany()

        const nodes = topics.map((t) => ({
            id: t.id,
            label: t.title
        }))

        const edges = relations.map((r) => ({
            id: r.id,
            source: r.sourceId,
            target: r.targetId
        }))

        return { nodes, edges }
    }

    /* добавить
    
    поиск связей 
    соседние темы GET /topics/1/neighbors
    добавление новой связи POST /relations
    
    */
}
