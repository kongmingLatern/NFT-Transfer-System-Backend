import { Module } from '@nestjs/common';
import { RespondController } from './respond.controller';
import { RespondService } from './respond.service';
import { DatabaseEntity } from '@/entities/Database.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([DatabaseEntity])],
  controllers: [RespondController],
  providers: [RespondService],
})
export class RespondModule {}
