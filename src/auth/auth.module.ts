import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([ // aqui se configuran las enttites que van a ser las tablas de la bd 
      User
    ]),
    CommonModule,
    PassportModule.register({
      defaultStrategy: "jwt"
    }),

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
    TypeOrmModule
  ]
})
export class AuthModule { }
