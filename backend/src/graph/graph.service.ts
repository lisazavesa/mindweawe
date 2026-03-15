import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GraphService {
    constructor(private prisma: PrismaService) {}
    
    async getGraph() {
        const topics = await this.prisma.topic.findMany()
        const relations = await this.prisma.relation.findMany()

        const nodes = topics.map((t) => ({
            id: String(t.id),
            label: t.title
        }))

        const edges = relations.map((r) => ({
            id: String(r.id),
            source: String(r.sourceId),
            target: String(r.targetId)
        }))

        return { nodes, edges }
    }

    /* добавить

    урааа, все получилось!! а можно как то красивее сделать чтобы значения были строковыми? или может в схеме призмы надо что то поменять? не нравится мне string(). а еще, норм, что я не могу с графом никак взаимодействовать не могу? двигать там, переставлять что то
    
    поиск связей 
    соседние темы GET /topics/1/neighbors
    добавление новой связи POST /relations
    
    */
}
