import { BadRequestException, Controller,Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/filefilter';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  // FileInterceptor solo si se esta usando express con nestjs
  @UseInterceptors(FileInterceptor('file',{
    fileFilter
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {

    if(!file) throw new BadRequestException("File is required");

    return file;
  }
}
