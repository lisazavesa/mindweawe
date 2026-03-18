import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GraphService } from './graph.service';
import { GetGraphByTopicDto } from './dto/get-graph-by-topic.dto';

@Controller('graph')
export class GraphController {
    constructor(
        private graphService: GraphService,
    ) {}

    @Get()
    getGraph() {
        return this.graphService.getGraph()
    }

    @Get(':id')
    getGraphByTopic(@Param() params: GetGraphByTopicDto) {
        return this.graphService.getGraphByTopic(params.id)
    }

}

