import { Controller, Get, Query } from '@nestjs/common';
import { OrdersService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}
  //默认查询所有订单，根据 uid 查询订单
  @Get('/selectAll/order')
  getOrder(@Query('uid') uid?: number) {
    return this.ordersService.findAll(uid);
  }
  //根据订单号查询订单
  @Get('/search/order')
  searchOrder(@Query('order_id') order_id) {
    return this.ordersService.findOne(order_id);
  }
}
