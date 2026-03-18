import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { GetTopicDto } from "./dto/get-topic.dto";
import { GetTopicsByDomain } from "./dto/get-topics-by-domain.dto";
import { GetTopicRelationsDto } from "./dto/get-topic-relations.dto";

@Controller("topics")
export class TopicsController {
    constructor(private topicsService: TopicsService) {}

    @Get(":id")
    getTopicById(@Param() params: GetTopicDto) {
        return this.topicsService.getTopicById(params.id);
    }

    @Get(":id/relations")
    getTopicPelations(
        @Param() params: GetTopicDto,
        @Query() query: GetTopicRelationsDto,
    ) {
        return this.topicsService.getTopicRelations(params.id, query.domain);
    }

    @Get()
    getTopicsByDomain(@Query() query: GetTopicsByDomain) {
        return this.topicsService.getTopicsByDomain(query.domain);
    }
}
