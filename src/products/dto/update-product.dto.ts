//import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// usar partialType de swagger para docuemtar el update-product.dto

export class UpdateProductDto extends PartialType(CreateProductDto) {}
