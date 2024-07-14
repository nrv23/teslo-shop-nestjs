import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { LoggerConfig } from 'src/common/config/logger';
import { ProductImage } from './entities/ProductImage.entity';


@Injectable()
export class ProductsService {
  private readonly logger = new LoggerConfig('Product.service');

  constructor(
    // inyeccion de dependencias mediante repositorios
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      const { images = [], ...productDetails } = createProductDto;

      const newProduct = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({
          url: image
        }))
      });
      await this.productRepository.save(newProduct);
      return {
        ...newProduct, images
      };
    } catch (error) {
      this.handleDbExecptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit, // toma el numero registros
      skip: offset, // empieza desde el numero de regitro
      relations: {
        images: true
      }
    });

    return products.map(produc => {
      return {
        ...produc,
        images: produc.images.map(img => img.url)
      }
    })
  }

  async findOne(term: string) {

    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({
        id: term
      })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder.where('title =:title or slug = :slug', {
        title: term,
        slug: term
      })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`product with term or slug "${term}" not found`);

    return product;
  }

  async findOnePlain(term: string) {
    const {
      images = [],
      ...rest
    } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(img => img.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...rest } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...rest
    });

    if (!product) throw new NotFoundException(`product with id "${id}" not found`);

    // query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(img => this.productImageRepository.create({ url: img }));
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDbExecptions(error);
    }
  }

  async remove(id: string) {
    const productdeleted = await this.productRepository.delete({ id });
    if (productdeleted.affected === 0) throw new NotFoundException(`product with id or slug "${id}" not found`);
  }

  private handleDbExecptions(error: any) {
    this.logger.showLog.error(error);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException(error);
  }

  async deleteAllProducts() {

    const query = this.productRepository.createQueryBuilder("product");
    try {

      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleDbExecptions(error);
    }
  }
}
