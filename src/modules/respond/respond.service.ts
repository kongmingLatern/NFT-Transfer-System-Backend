import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { Repository } from 'typeorm';
import { ToolsService } from '@/common/utils/tools.service';
import { MergeArrays } from '@/common/config/merge';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class RespondService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}

  async getWant() {
    const sqlstr = `SELECT want_table.id as buy_id,
    want_table.uid as buy_uid,
    users.username as buy_username,
    want_table.nft_desc as buy_desc,
    want_table.price as buy_price
        from users,want_table 
        WHERE users.uid=want_table.uid;`;
    const result = await this.repository.query(sqlstr);
    if (!result) ToolsService.fail('请求失败！！');
    return result;
  }

  async uploadWant({ uid, nft_type, nft_desc, price }) {
    const id = uuidv4();
    const sqlstr = `insert into want_table (id,uid,nft_type,nft_desc,price,date) 
    values('${id}','${uid}',${nft_type},'${nft_desc}',${price},CURDATE())`;
    console.log(sqlstr);

    const result = await this.repository.query(sqlstr);
    if (!result) ToolsService.fail('插入失败！！');
    return '插入成功！！';
  }
  async getRespond() {
    const sqlstr = `SELECT nfts.uid,nft_name,basic_bid  FROM nfts,responds where nfts.uid=responds.respond_uid
    `;
    const result = await this.repository.query(sqlstr);
    if (result.length === 0) ToolsService.fail('请求失败！！');
    return result;
  }
  async respondSearch(uid) {
    const sql1 = `SELECT  responds.id as response_id,
    want_table.uid as buy_id,
    want_table.nft_desc as buy_desc , 
    nfts.nft_img as response_nft_img,
		nfts.nft_desc as response_desc ,
		nfts.basic_bid  as response_price
    from responds,want_table,nfts
    WHERE responds.want_id=want_table.id 
    and responds.nft_id=nfts.nft_id
    and  want_table.uid='${uid}'`;
    const sql2 = `SELECT users.username as response_username,
    responds.respond_uid 
FROM users,responds,want_table
WHERE users.uid =responds.respond_uid and want_table.id=responds.want_id
    AND want_table.uid='${uid}'`;
    const result1 = await this.repository.query(sql1);
    const result2 = await this.repository.query(sql2);
    const newdata = MergeArrays(result1, result2);
    return newdata;
  }
}
