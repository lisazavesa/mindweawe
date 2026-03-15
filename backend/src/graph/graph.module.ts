import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';
import { GraphController } from './graph.controller';
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [GraphService, PrismaService],
  controllers: [GraphController]
})
export class GraphModule {}
