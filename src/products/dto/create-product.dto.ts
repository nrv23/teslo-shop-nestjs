import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";


export class CreateProductDto {
    
    @IsString()
    @MinLength(4)
    title: string;

    @IsNumber()
    @IsPositive()
    @Min(1)
    @IsOptional()
    price?: number;

    @IsString()
    @MinLength(4)
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?:string;

    @IsNumber()
    @IsPositive()
    @Min(1)
    @IsOptional()
    stock?:number;

    @IsString({each: true}) // cada elemento del arreglo debe ser string
    @IsArray()
    sizes: string[];

    @IsString()
    @IsIn(["masculino","femenino","unisex","niño"])
    gender: string;

    @IsString({each: true}) // cada elemento del arreglo debe ser string
    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsString({each: true}) // cada elemento del arreglo debe ser string
    @IsArray()
    @IsOptional()
    images?: string[];
}
