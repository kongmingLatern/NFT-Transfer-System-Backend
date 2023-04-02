import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { ToolsService } from '@/common/utils/tools.service';
import { MergeArrays } from '@/common/config/merge';
@Injectable()
export class NftService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}
  async getSelectNft(uid) {
    const sql1 = `SELECT nfts.nft_id,nfts.nft_name,type_nft.type,
    nfts.nft_img,nfts.nft_desc,nfts.status,users.username
        FROM nfts,type_nft,users
        WHERE nfts.nft_type=type_nft.id and users.uid=nfts.uid and nfts.uid='${uid}'`;
    const sql2 = `SELECT nfts.owner as owner_id,users.username as owner_username 
    FROM nfts,type_nft,users
            WHERE nfts.nft_type=type_nft.id 
            and users.uid=nfts.uid AND nfts.uid='${uid}'`;
    const result1 = await this.repository.query(sql1);
    const result2 = await this.repository.query(sql2);
    const newArr = MergeArrays(result1, result2);
    return newArr;
  }
  //审核
  async checknft(nft_id) {
    let sqlstr = `SELECT transfer_type  FROM nfts WHERE nft_id='${nft_id}'`;
    const lis = await this.repository.query(sqlstr);
    let state = 0;
    if (lis[0].transfer_type === 1) state = 2;
    sqlstr = `UPDATE nfts set status=${state}  WHERE nft_id='${nft_id}'`;
    const result = await this.repository.query(sqlstr);
    if (typeof result === 'object') return '修改成功！！';
    else ToolsService.fail('修改失败');
  }
  //修改nft
  async changeNft(obj) {
    let str = '';
    Object.keys(obj).map((item) => {
      if (item !== 'nft_id') str += item + "= '" + obj[item] + "',";
    });
    str = str.slice(0, -1);
    const sqlstr = `UPDATE nfts set ${str} WHERE nft_id='${obj.nft_id}'`;
    const data = await this.repository.query(sqlstr);
    return data;
  }
}
