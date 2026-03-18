import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';
import { GraphController } from './graph.controller';
import { PrismaService } from "../prisma/prisma.service";
import { TopicsService } from 'src/topics/topics.service';

@Module({
  providers: [GraphService, PrismaService, TopicsService],
  controllers: [GraphController]
})
export class GraphModule {}
