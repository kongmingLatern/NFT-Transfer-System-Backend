import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { log } from 'console';
@Injectable()
export class TrendService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}
  async getTrend(nft_type) {
    let sqlstr;
    if (typeof nft_type !== 'undefined') {
      const sql = `SELECT id from type_nft WHERE type='${nft_type}'`;
      const type = await this.repository.query(sql);
      sqlstr = `SELECT nfts.nft_id, nfts.nft_img,nfts.nft_name,nfts.nft_desc,
      nfts.basic_bid,nfts.lower_bid,nfts.high_bid,
      COUNT(auction_table.nft_id) AS personcount
      FROM auction_table
      JOIN nfts ON auction_table.nft_id = nfts.nft_id
      WHERE nfts.nft_type = ${type[0].id}
      GROUP BY nfts.nft_id, nfts.nft_img, nfts.basic_bid
      ORDER BY count DESC`;
    } else {
      sqlstr = `
      SELECT nfts.nft_id, nfts.nft_img,nfts.nft_name,nfts.nft_desc,
      nfts.basic_bid,nfts.lower_bid,nfts.high_bid,
      COUNT(auction_table.nft_id) AS personcount
              FROM auction_table
              JOIN nfts ON auction_table.nft_id = nfts.nft_id
              GROUP BY nfts.nft_id, nfts.nft_img, nfts.basic_bid
              ORDER BY count DESC	`;
    }
    const data = await this.repository.query(sqlstr);
    return data;
  }
}
