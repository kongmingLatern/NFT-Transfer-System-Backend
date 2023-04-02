import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { DatabaseEntity } from '@/entities/Database.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DatabaseEntity])],
  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}
