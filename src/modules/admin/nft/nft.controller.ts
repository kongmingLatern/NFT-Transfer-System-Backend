import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { NftService } from './nft.service';
@Controller()
export class NftController {
  constructor(private readonly nftService: NftService) {}
  @Get('/select/nft')
  getSelectNft(@Query('uid') uid) {
    return this.nftService.getSelectNft(uid);
  }
  //审核nft
  @Post('/admin/add/nft')
  changeNftstatus(@Body() { nft_id }) {
    return this.nftService.checknft(nft_id);
  }
  //后台修改nft
  @Put('/admin/change/nft')
  changeNft(@Body() obj) {
    return this.nftService.changeNft(obj);
  }
}
