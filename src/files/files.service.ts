import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {

    getStaticProductImage(imageName: string) {
        const path = join(__dirname, '../../static/products',imageName );
      
        if(existsSync(path)) {
            return path;
        }

        throw new BadRequestException("La imagen no existe");
    }
  
}
