import { Module } from '@nestjs/common';
import { OrdersService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DatabaseEntity])],
  providers: [OrdersService],
  controllers: [OrderController],
})
export class OrderModule {}
