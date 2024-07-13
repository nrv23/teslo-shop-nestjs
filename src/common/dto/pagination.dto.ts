import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Min(1)
    // generar la conversion implicita
    @Type(() => Number)
    limit?: number;

    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Min(0)
    // generar la conversion implicita
    @Type(() => Number)
    offset?: number;
}