import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GraphService } from './graph.service';

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
    getGraphByTopic(@Param('id', ParseIntPipe) id: number ) {
        return this.graphService.getGraphByTopic(id)
    }

}

