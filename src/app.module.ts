import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(), // configModule siempre va primero porque se debe configurar las variables de entorno
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }), 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public') // servidor contenido estattico en carpetas publicas
    }),
    ProductsModule, CommonModule, SeedModule, FilesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
