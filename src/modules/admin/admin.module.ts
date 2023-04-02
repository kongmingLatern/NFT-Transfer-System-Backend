import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { NftModule } from './nft/nft.module';
import { OrderModule } from './order/order.module';
import { SwiperModule } from './swiper/swiper.module';
@Module({
  imports: [UserModule, NftModule, OrderModule, SwiperModule],
})
export class AdminModule {}
