import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUserDecorator } from 'src/auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('products')
// progeter controladores globalmente 
// @Auth(ValidRoles.superUser, ValidRoles.user)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUserDecorator() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.superUser)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUserDecorator() user: User) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.superUser)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
