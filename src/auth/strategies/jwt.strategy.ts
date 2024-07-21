import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt'
import { User } from "../entities/user.entity";
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from "@nestjs/config";
import { ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get("JWT_SECRET_KEY"),
            // indicar que recibe el token del header de autorizacion
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload) : Promise<User> { // en la estrategia debe crearse esta funcion
        // con el mismo nombre sintacticamente

        const { id } = payload;

        if(!id) throw new UnauthorizedException('Invalid token');

        const user = await this.userRepo.findOneBy({id});
        
        if(!user) throw new UnauthorizedException('Invalid token');
        if(!user.isActive) throw new UnauthorizedException('Inactive user');

        return user; // retorna el request para que pueda usarse globalmente
    }
}