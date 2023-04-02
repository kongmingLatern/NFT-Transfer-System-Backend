import { Controller, Get, Put, Post, Query, Body } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { createReadStream } from 'fs';

@Controller('/personal')
export class PersonalController {
  constructor(private readonly pesrsonalService: PersonalService) {}
  //进入个人信息页
  @Get()
  getInformation(@Query('uid') uid: number) {
    return this.pesrsonalService.getInformation(uid);
  }
  //修改用户
  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  changeUser(@UploadedFile() avatar, @Body() userobj) {
    return this.pesrsonalService.changeUser(avatar.path, userobj);
  }
}
