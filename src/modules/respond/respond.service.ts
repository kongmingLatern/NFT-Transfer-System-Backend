import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { Repository } from 'typeorm';
import { ToolsService } from '@/common/utils/tools.service';
import { MergeArrays } from '@/common/config/merge';
@Injectable()
export class RespondService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}

  async getWant() {
    const sqlstr = `SELECT want_table.date,want_table.uid, users.username,want_table.desc,want_table.price 
    from users,want_table WHERE users.uid=want_table.uid`;
    const result = await this.repository.query(sqlstr);
    if (!result) ToolsService.fail('请求失败！！');
    return result;
  }

  async uploadWant({ uid, nft_type, nft_desc, price }) {
    const sqlstr = `insert into want_table (uid,nft_type,nft_desc,price,date) 
    values(${uid},${nft_type},'${nft_desc}',${price},CURDATE())`;
    const result = await this.repository.query(sqlstr);
    console.log(result);
    if (!result) ToolsService.fail('插入失败！！');
    return '插入成功！！';
  }
  async getRespond() {
    const sqlstr = `SELECT nfts.uid,nft_name,basic_bid  FROM nfts,responds where nfts.uid=responds.respond_id`;
    const result = await this.repository.query(sqlstr);
    if (result.length === 0) ToolsService.fail('请求失败！！');
    return result;
  }
  async respondSearch(uid) {
    const sql1 = `SELECT  responds.id,responds.respond_id,want_id,want_table.desc, 
    nfts.nft_img,nfts.nft_desc,nfts.basic_bid
    from responds,want_table,nfts
    WHERE responds.want_id=want_table.id 
    and responds.nft_id=nfts.nft_id
    and  want_table.uid=${uid}`;
    const sql2 = `SELECT users.username,responds.respond_id 
    FROM users,responds,want_table
    WHERE users.uid =responds.respond_id and want_table.id=responds.want_id
    AND want_table.uid=${uid}`;

    const result1 = await this.repository.query(sql1);
    const result2 = await this.repository.query(sql2);
    const newdata = MergeArrays(result1, result2);
    return newdata;
  }
}
