import { IsIn, IsOptional, IsString } from "class-validator";

export class GetTopicRelationsDto {
    @IsOptional()
    @IsString()
    @IsIn(["backend", "frontend", "shared"])
    domain?: string;
}
