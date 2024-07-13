import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';


@Injectable()
export class ProductsService {
  private readonly logger = new Logger('Product.service');

  constructor(
    // inyeccion de dependencias mediante repositorios
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = this.productRepository.create(createProductDto);
      await this.productRepository.save(newProduct);
      return newProduct;
    } catch (error) {
      this.handleDbExecptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    return await this.productRepository.find({
      take: limit, // toma el numero registros
      skip: offset // empieza desde el numero de regitro
    });
  }

  async findOne(term: string) {

    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({
        id: term
      })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where('title =:title or slug = :slug', {
        title: term,
        slug: term
      }).getOne();
    }

    if (!product)
      throw new NotFoundException(`product with term or slug "${term}" not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    try {

      const product = await this.productRepository.preload({
        id,
        ...updateProductDto
      });

      if (!product) throw new NotFoundException(`product with id "${id}" not found`);
      await this.productRepository.save(product);
      return product;

    } catch (error) {
      this.handleDbExecptions(error);
    }
  }

  async remove(id: string) {
    const productdeleted = await this.productRepository.delete({ id });
    if (productdeleted.affected === 0) throw new NotFoundException(`product with id or slug "${id}" not found`);
  }

  private handleDbExecptions(error: any) {
    this.logger.error(error);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException(error);
  }
}
