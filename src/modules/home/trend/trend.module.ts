import { Module } from '@nestjs/common';
import { TrendController } from './trend.controller';
import { TrendService } from './trend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DatabaseEntity])],
  controllers: [TrendController],
  providers: [TrendService],
})
export class TrendModule {}
