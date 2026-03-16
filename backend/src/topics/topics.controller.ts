import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
    constructor(private topicsService: TopicsService) {}

    @Get(':id')
    getTopicById(@Param('id', ParseIntPipe) id: number) {
        return this.topicsService.getTopicById(id)
    }
}