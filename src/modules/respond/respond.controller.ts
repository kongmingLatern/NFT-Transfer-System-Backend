import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { RespondService } from './respond.service';

@Controller()
export class RespondController {
  constructor(private readonly respondService: RespondService) {}
  //查询所有的求购信息
  @Get('/selectAll/buy_message')
  getwant() {
    return this.respondService.getWant();
  }

  @Post('/uploadwant')
  uploadWant(@Body() obj) {
    return this.respondService.uploadWant(obj);
  }

  @Get('/respond')
  getRespond() {
    return this.respondService.getRespond();
  }

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('image'))
  // uploadFile(@UploadedFile() img, @Body() data) {
  //   // return this.respondService.uploadFile(data, img.path);
  // }

  @Get('/selectAll/response')
  getResponse(@Query('uid') uid) {
    return this.respondService.respondSearch(uid);
  }
}
