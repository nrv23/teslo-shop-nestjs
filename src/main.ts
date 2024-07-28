import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  // configurar swagger en nestjs
  
  const config = new DocumentBuilder()
    .setTitle('Teslo Api Doc')
    .setDescription('Teslo API description')
    .setVersion('1.0')
    .build();
    // configurar endpoint para ver documentacion
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);


  await app.listen(+process.env.PORT);
  console.log("Servidor escuchando peticiones en puerto " + process.env.PORT)
}
bootstrap();
