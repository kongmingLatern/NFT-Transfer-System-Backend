import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { MergeArrays } from '@/common/config/merge';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}
  async findAll(uid) {
    let newdata;
    //默认查询所有订单
    const sql = ` AND orders.buyer_id=${uid}`;
    if (typeof uid !== 'undefined') {
      newdata = this.returnNew(sql);
    } else {
      newdata = this.returnNew();
    }
    return newdata;
  }
  async findOne(order_id: number) {
    const sql = ` AND orders.order_id=${order_id}`;
    return await this.returnNew(sql);
  }
  async returnNew(condition?: any) {
    let sql1 = `SELECT orders.order_id,orders.transaction_price,nfts.nft_name,
    users.username,nft_img,users.username,orders.transaction_date
    from users,nfts,orders 
    WHERE  users.uid=orders.buyer_id and nfts.nft_id=orders.nft_id`;
    let sql2 = `SELECT orders.seller_id,users.username as seller_username
    FROM users,orders  
    WHERE orders.seller_id=users.uid`;
    if (typeof condition !== 'undefined') {
      sql1 += condition;
      sql2 += condition;
    }
    const result = await this.repository.query(sql1);
    const result1 = await this.repository.query(sql2);
    const newarr = MergeArrays(result, result1);
    return newarr;
  }
}
