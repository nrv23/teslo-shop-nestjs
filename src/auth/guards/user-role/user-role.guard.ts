import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { META_ROLES } from '../../decorators/role-protected/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector, // leer los metadatas
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {

  }
  canActivate(
    context: ExecutionContext, // aqui leo el requuest
  ): boolean | Promise<boolean> | Observable<boolean> {

    const req = context.switchToHttp().getRequest();
    const validRoles: string[] = this.reflector.get(META_ROLES,context.getHandler());
    const user = req.user as User;
    
    if(!validRoles || validRoles.length === 0) return true;

    if(!user) throw new BadRequestException('Invalid token');

    for (const role of user.roles) {
      if(validRoles.includes(role)) return true;
    }
    
    throw new ForbiddenException("Invalid role for user");
  }
}
