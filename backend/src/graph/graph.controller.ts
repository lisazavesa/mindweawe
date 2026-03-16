import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
    constructor(private graphService: GraphService) {}

    @Get()
    getGraph() {
        return this.graphService.getGraph()
    }
}

