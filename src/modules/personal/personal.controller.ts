import { Controller, Get, Put, Query, Body } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile, UseInterceptors } from '@nestjs/common';

@Controller('/personal')
export class PersonalController {
  constructor(private readonly pesrsonalService: PersonalService) {}
  //进入个人信息页
  @Get()
  getInformation(@Query('uid') uid) {
    return this.pesrsonalService.getInformation(uid);
  }
  //修改用户
  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  changeUser(@UploadedFile() avatar, @Body() userobj) {
    return this.pesrsonalService.changeUser(avatar.path, userobj);
  }
}
