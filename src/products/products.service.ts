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

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product)
      throw new NotFoundException(`product with id or slug "${id}" not found`);

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const productdeleted = await this.productRepository.delete({id});
    if(productdeleted.affected === 0) throw new NotFoundException(`product with id or slug "${id}" not found`);
  }

  private handleDbExecptions(error: any) {
    this.logger.error(error);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException(error);
  }
}
