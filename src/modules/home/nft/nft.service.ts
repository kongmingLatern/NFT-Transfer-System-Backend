import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}
  async getAllnft() {
    const sql = `SELECT nfts.nft_id,nfts.nft_name,type_nft.type,nfts.uid,users.username,
    nfts.nft_img,nfts.nft_desc,nfts.basic_bid,
    nfts.lower_bid,nfts.high_bid,nfts.status
        FROM nfts,type_nft,users
        WHERE nfts.nft_type=type_nft.id and users.uid=nfts.uid`;
    const result = await this.repository.query(sql);
    return result;
  }
  async getNft(type?: string) {
    let sql = `
    SELECT nfts.nft_id,nfts.nft_name,type_nft.type,nfts.uid,
    nfts.nft_img,nfts.nft_desc,nfts.basic_bid,
    nfts.lower_bid,nfts.high_bid,nfts.status,users.username
        FROM nfts,type_nft,users
        WHERE nfts.nft_type=type_nft.id and users.uid=nfts.uid`;
    if (typeof type !== 'undefined') sql += ` and type_nft.type='${type}'`;
    const result = await this.repository.query(sql);
    return result;
  }
  async searchNft({ nft_name }) {
    const sql = `SELECT nfts.nft_id,nfts.nft_name,type_nft.type,
    nfts.nft_img,nfts.nft_desc,nfts.status,users.username
        FROM nfts,type_nft,users
        WHERE nfts.nft_type=type_nft.id and users.uid=nfts.uid and nft_name LIKE '%${nft_name}%'`;
    const result = await this.repository.query(sql);
    return result;
  }
}
