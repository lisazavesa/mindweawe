import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
	constructor(private topicsService: TopicsService) {}

	@Get(':id')
	getTopicById(@Param('id', ParseIntPipe) id: number) {
		return this.topicsService.getTopicById(id);
	}

	@Get(':id/relations')
	getTopicPelations(
		@Param('id', ParseIntPipe) id: number,
		@Query('domain') domain?: string,
	) {
		return this.topicsService.getTopicRelations(id, domain);
	}
}
