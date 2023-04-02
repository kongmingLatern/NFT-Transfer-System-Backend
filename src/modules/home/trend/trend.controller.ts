import { Controller, Get, Param, Query } from '@nestjs/common';
import { TrendService } from './trend.service';
@Controller('/trend')
export class TrendController {
  constructor(private readonly swiperService: TrendService) {}
  @Get()
  getTrend(@Query('type') type) {
    return this.swiperService.getTrend(type);
  }
}
