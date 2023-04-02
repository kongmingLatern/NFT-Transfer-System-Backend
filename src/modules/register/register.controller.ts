import { Body, Controller, Post } from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { RegisterService } from './register.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
@Controller()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}
  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async Submitmess(
    @UploadedFile() image,
    @Body() obj: { username: string; password: string },
  ) {
    return this.registerService.storeData(obj, image.path);
  }
}
