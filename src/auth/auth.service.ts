import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoggerConfig } from '../common/config/logger';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger: LoggerConfig = new LoggerConfig('auth.service');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
  }
  async create(createAuthDto: CreateUserDto) {

    try {

      const { password, ...userData  } = createAuthDto;

      const newUser = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(newUser);
     // delete newUser.password;

      return {
        user:newUser,
        token: this.getJwtToken({
          id: newUser.id
        })
      };

    } catch (error) {
      this.handleDbError(error);
    }
  }

  async login(loginDto: LoginDto) {

      const { password, email } = loginDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true }
      });

      if(!user) throw new UnauthorizedException("Credenciales incorrectas");
      
      const matched = bcrypt.compareSync(password,user.password);

      if(matched) return {
        user,
        token: this.getJwtToken({
          id: user.id
        })
      };

      throw new UnauthorizedException("Credenciales incorrectas");
  }

  /*findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }*/

  private handleDbError(error: any): never {
    this.logger.showLog.error(error.detail);
    if (error.code === "23505") throw new BadRequestException("El usuario se registró anteriormente");
    throw new InternalServerErrorException(error.message);
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  } 

  checkAuthStatus(user: User) {
    return {
      user,
      token: this.getJwtToken({
        id: user.id
      })
    };
  }

}
