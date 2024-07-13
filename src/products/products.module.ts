import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([ // aqui se configuran las enttites que van a ser las tablas de la bd 
      // por modulo de aplicacion.
      // En este caso solo seria product
      Product,
      CommonModule
    ])
  ]
})
export class ProductsModule {}
