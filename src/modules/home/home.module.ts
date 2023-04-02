import { Module } from '@nestjs/common';
import { TrendModule } from './trend/trend.module';
import { NftModule } from './nft/nft.module';

@Module({
  imports: [TrendModule, NftModule],
})
export class HomeModule {}
