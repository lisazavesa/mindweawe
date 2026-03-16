import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TopicsService {
    constructor(private prisma: PrismaService) {}

    async getTopicById(id: number) {
        const topic = await this.prisma.topic.findUnique({
            where: { id },
            include: {
                sourceRelations : {
                    include: { target: true } 
                },
                targetRelations : {
                    include: { source: true }
                }
            }
        })

        if (!topic) {
            throw new NotFoundException(`Topic with id ${id} not found`);
        }     

        return {
            ...topic,
            necessary: topic.targetRelations.map(r => ({
                id: r.source.id,
                title: r.source.title,
                type: r.type
            })),
            recommended: topic.sourceRelations.map(r => ({
                id: r.target.id,
                title: r.target.title,
                type: r.type
            }))
        } 
    }
}
