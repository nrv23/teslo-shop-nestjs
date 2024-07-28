import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {

  }

  async executeSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.addProducts(adminUser);
    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder()
    queryBuilder.delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const { users: SeedUsers } = initialData;
    const users: User[] = [];

    SeedUsers.forEach(user => {
      user.password = bcrypt.hashSync(user.password, 10);
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];
  }

  private async addProducts(user: User) {

    await this.productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];

    products.forEach(pro => {
      insertPromises.push(this.productService.create(pro, user));
    });
    await Promise.all(insertPromises);
  }

}
