import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { DatabaseEntity } from '@/entities/Database.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([DatabaseEntity])],
  providers: [NftService],
  controllers: [NftController],
})
export class NftModule {}
