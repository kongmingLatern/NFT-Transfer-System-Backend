import { Body, Get, Controller, Post, Put } from '@nestjs/common';
import { SwiperService } from './swiper.service';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';

@Controller()
export class SwiperController {
  constructor(private readonly swiperService: SwiperService) {}
  //轮播图
  //所有
  @Get('/selectAll/swiper')
  getAllswiper() {
    return this.swiperService.getAllSwiper();
  }
  //修改
  @Put('/change/swiper')
  @UseInterceptors(FileInterceptor('img'))
  changeSwiper(@UploadedFile() img?: object, @Body() obj?: object) {
    return this.swiperService.changeSwiper(img, obj);
  }
  //上传
  @Post('/add/swiper')
  @UseInterceptors(FileInterceptor('img'))
  addSwiper(@UploadedFile() img: object, @Body() obj) {
    return this.swiperService.addSwiper(img, obj);
  }

  //分类
  @Get('selectAll/type')
  getType() {
    return this.swiperService.getType();
  }
  @Put('/change/type')
  changeType(@Body() obj) {
    return this.swiperService.changeType(obj);
  }
  @Post('/add/type')
  addType(@Body() obj) {
    return this.swiperService.addType(obj);
  }
}
