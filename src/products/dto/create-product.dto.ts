import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";


export class CreateProductDto {

    @ApiProperty()
    @IsString()
    @MinLength(4)
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @IsOptional()
    price?: number;

    @ApiProperty()
    @IsString()
    @MinLength(4)
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @IsOptional()
    stock?: number;

    @ApiProperty()
    @IsString({ each: true }) // cada elemento del arreglo debe ser string
    @IsArray()
    sizes: string[];

    @ApiProperty()
    @IsString()
    @IsIn(["masculino", "femenino", "unisex", "niño"])
    gender: string;

    @ApiProperty()
    @IsString({ each: true }) // cada elemento del arreglo debe ser string
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty()
    @IsString({ each: true }) // cada elemento del arreglo debe ser string
    @IsArray()
    @IsOptional()
    images?: string[];
}
