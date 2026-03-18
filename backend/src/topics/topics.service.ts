import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TopicsService {
    constructor(private prisma: PrismaService) {}

    async getTopicById(id: number) {
        const topic = await this.prisma.topic.findUnique({
            where: { id },
            include: {
                sourceRelations: {
                    include: { target: true },
                },
                targetRelations: {
                    include: { source: true },
                },
            },
        });

        if (!topic) {
            throw new NotFoundException(`Topic with id ${id} not found`);
        }

        return {
            ...topic,
            necessary: topic.targetRelations.map((r) => ({
                id: r.source.id,
                title: r.source.title,
                type: r.type,
            })),
            recommended: topic.sourceRelations.map((r) => ({
                id: r.target.id,
                title: r.target.title,
                type: r.type,
            })),
        };
    }

    async getTopicRelations(id: number, domain?: string) {
        const topic = await this.getTopicById(id);

        const filterDomain = (t) => !domain || t.domain === domain;

        // 🔴 NECESSARY (входящие связи)
        const necessary = topic.targetRelations
            .filter(r => r.type === 'NECESSARY')
            .map(r => r.source)
            .filter(filterDomain)
            .map(t => ({
                id: t.id,
                title: t.title,
                description: t.description,
            }));

        // 🟡 RELATED (в обе стороны!)
        const relatedFromSource = topic.sourceRelations
            .filter(r => r.type === 'RELATED')
            .map(r => r.target);

        const relatedFromTarget = topic.targetRelations
            .filter(r => r.type === 'RELATED')
            .map(r => r.source);

        const related = [...relatedFromSource, ...relatedFromTarget]
            .filter(filterDomain)
            .map(t => ({
                id: t.id,
                title: t.title,
                description: t.description,
            }));

        return { necessary, related };
    }

    async getTopicsByDomain (domain?: string) {
        const topics = await this.prisma.topic.findMany({
            where: domain ? { domain } : {}
        })

        return topics

        // return {
        //     topics,
        //     include: {
        //         sourceRelations: {
        //             include: { target: true },
        //         },
        //         targetRelations: {
        //             include: { source: true },
        //         },
        //     },
        // }
    }
}
