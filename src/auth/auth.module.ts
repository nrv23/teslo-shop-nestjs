import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([ // aqui se configuran las enttites que van a ser las tablas de la bd 
      User
    ]),
    CommonModule,
    // aqui en passport se indica cual estrategia se va usar para validar la sesion
    PassportModule.register({
      defaultStrategy: "jwt"
    }),
    ConfigModule,
    // modulo asincrono 

    JwtModule.registerAsync({
      imports: [ConfigModule], // importar modelo
      inject: [ConfigService], // inyctar servicio
      useFactory: (configService: ConfigService) => { // aqui se hace la inyeccion de depencias como se haria en cualquier servicio
        return {
          secret: configService.get("JWT_SECRET_KEY"),
          signOptions: {
            expiresIn: "24h"
          }
        }
      },
    })
    /*JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: "24h"
      }
    })*/
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
    AuthService
  ]
})
export class AuthModule { }
