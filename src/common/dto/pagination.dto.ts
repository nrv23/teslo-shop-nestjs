import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    // documentar un dto con swgger

    @ApiProperty({
        description: "limit de registros por pagina",
        minimum: 1
    })
    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Min(1)
    // generar la conversion implicita
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        description: "En cual numero de registro empieza a obtener esos registros",
        minimum: 1
    })
    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Min(0)
    // generar la conversion implicita
    @Type(() => Number)
    offset?: number;
}