import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/filefilter';
import { diskStorage } from 'multer';
import { fileRename } from './helpers/filerRename';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService, private readonly configService: ConfigService) { }

  @Post('product')
  // FileInterceptor solo si se esta usando express con nestjs
  @UseInterceptors(FileInterceptor('file', {
    fileFilter,
    storage: diskStorage({ // ./ root del proyecto
      destination: './static/products',
      filename: fileRename
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {

    if (!file) throw new BadRequestException("File is required");

    const secureUrl = `${this.configService.get("HOST_API")}/files/product/${file.filename}`;

    return {
      secureUrl
    };
  }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param("imageName") imageName: string) {

    const path = this.filesService.getStaticProductImage(imageName);
    return res.sendFile(path);
  }
}
