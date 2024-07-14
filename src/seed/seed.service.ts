import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(private readonly productService: ProductsService) {

  }

  async executeSeed() {
    await this.addProducts();
    return 'SEED EXECUTED';
  }

  private async addProducts() {
    
    await this.productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];

    products.forEach(pro => {
      insertPromises.push(this.productService.create(pro));
    });
    await Promise.all(insertPromises);
  }
 
}
