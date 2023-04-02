import {
  Controller,
  Query,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NftService } from './nft.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile, UseInterceptors } from '@nestjs/common';

@Controller()
export class NftController {
  constructor(private readonly nftService: NftService) {}
  //进入详情页
  @Get('/select/nft/nft_id')
  getDetail(@Query('nft_id') nft_id: number) {
    return this.nftService.getDetail(nft_id);
  }
  //加入购物车
  @Post('/add')
  addCart(@Body() obj) {
    return this.nftService.addCart(obj);
  }
  //参与拍卖
  @Put('/auction')
  addAuction(@Body() obj) {
    return this.nftService.addAuction(obj);
  }
  //生成直售订单
  @Get('/directorder')
  nftoder(@Query('arrobj') arrobj) {
    return this.nftService.nftOrder(arrobj);
  }
  //点击购物车
  // @UseGuards(AuthGuard('jwt'))
  @Get('/shoppingcart')
  getcart(@Query('uid') uid: number) {
    return this.nftService.getCart(uid);
  }
  //删除购物车里面的东西
  @Delete('/shoppingcart')
  deleteCart(@Body() obj) {
    return this.nftService.deleteCart(obj);
  }
  //上传nft
  @Post('/upload/nft')
  @UseInterceptors(FileInterceptor('nft_img'))
  uploadnft(@UploadedFile() nft_img, @Body() upload) {
    return this.nftService.uploadNft(nft_img, upload);
  }
  @Post('/collection')
  @UseInterceptors(FileInterceptor('image'))
  collectionUpload(@UploadedFile() img, @Body() upload) {
    // const file = createReadStream('path/to/image.jpg');
    // const image = sharp();

    // // 将图片切割成9张图
    // image.extract({ width: 100, height: 100, left: 0, top: 0 }).toFile('path/to/output1.jpg');
    // image.extract({ width: 100, height: 100, left: 100, top: 0 }).toFile('path/to/output2.jpg');
    // image.extract({ width: 100, height: 100, left: 200, top: 0 }).toFile('path/to/output3.jpg');
    // image.extract({ width: 100, height: 100, left: 0, top: 100 }).toFile('path/to/output4.jpg');
    // image.extract({ width: 100, height: 100, left: 100, top: 100 }).toFile('path/to/output5.jpg');
    // image.extract({ width: 100, height: 100, left: 200, top: 100 }).toFile('path/to/output6.jpg');
    // image.extract({ width: 100, height: 100, left: 0, top: 200 }).toFile('path/to/output7.jpg');
    // image.extract({ width: 100, height: 100, left: 100, top: 200 }).toFile('path/to/output8.jpg');
    // image.extract({ width: 100, height: 100, left: 200, top: 200 }).toFile('path/to/output9.jpg');

    // // 将图片保存到服务器
    // file.pipe(image);
    return this.nftService.uploadNft(img, upload);
  }
}
