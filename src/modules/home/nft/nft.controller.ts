import { Controller, Query, Get, Post, Body } from '@nestjs/common';
import { NftService } from './nft.service';
@Controller()
export class NftController {
  constructor(private readonly service: NftService) {}
  //得到所有的nft
  @Get('/selectAll/nft')
  getAllnft() {
    return this.service.getAllnft();
  }
  //根据分类筛选
  @Get('/selectAll/nft/')
  getnft(@Query('type') type?: string) {
    return this.service.getNft(type);
  }

  //搜索
  @Post('/nft/search')
  searchNft(@Body() nft_name) {
    return this.service.searchNft(nft_name);
  }
}
