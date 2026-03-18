import { IsIn, IsOptional, IsString } from "class-validator";

export class GetTopicsByDomain {
    @IsOptional()
    @IsString()
    @IsIn(['backend', 'frontend', 'shared'])
    domain?: string
}