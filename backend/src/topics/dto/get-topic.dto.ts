import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class GetTopicDto {
    @IsInt()
    @Type(() => Number)
    id: number
}