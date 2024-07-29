import { Controller, Get} from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Seed")
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.superUser, ValidRoles.admin,ValidRoles.user)
  findAll() {
    return this.seedService.executeSeed();
  }

  

}
