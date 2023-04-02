import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { DatabaseEntity } from '@/entities/Database.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getTime } from '@/common/config/gettime';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}
  //每隔45秒执行一次
  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.debug(getTime());
  // }
  //拍卖时间到
  @Cron('* 1 * * * *')
  isGeneratorFunction() {
    // const sql=``
    // this.repository.query()
  }

  //求购表的挂载时间
  @Cron('* * 12 * * *')
  async getWant() {
    const sql = `SELECT want_table.id
    FROM want_table
    LEFT JOIN responds
    ON want_table.id = responds.want_id
    WHERE want_table.date+7 < CURDATE()  AND responds.id IS NULL;`;
    const state = await this.repository.query(sql);
    state.map((item) => {
      const delsql = `DELETE FROM want_table  WHERE want_id=${item.id}`;
      this.repository.query(delsql);
    });
  }

  //每10秒执行一次
  @Interval(10000)
  async handleInterval() {
    // const a = await this.repository.query('select * from auction_table');
    // console.log(a);
  }

  //   @Timeout(10000) //10秒只执行一次
  //   handleTimeout() {
  //     this.logger.debug('3');
  //   }

  //   @Interval(1000)
  //   sendEmail() {
  //     this.logger.debug('3');
  //   }
}
