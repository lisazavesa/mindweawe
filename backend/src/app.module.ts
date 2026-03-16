import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphModule } from './graph/graph.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [GraphModule, PrismaModule, TopicsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
