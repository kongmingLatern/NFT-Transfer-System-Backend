import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { ToolsService } from '@/common/utils/tools.service';
import { mergeStr, imgAddress } from '@/common/config/merge';

@Injectable()
export class SwiperService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}
  //轮播图操作
  async getAllSwiper() {
    const sql = `SELECT img_id,img_src,img_desc,type FROM swiper`;
    const result = await this.repository.query(sql);
    return result;
  }
  async changeSwiper(img, obj) {
    let str = '';
    let img_src = '';
    if (typeof img !== 'undefined' && Object.keys(obj).length != 1) {
      img_src = imgAddress(img);
      str = mergeStr(obj.img_id, obj);
      str = str + `,img_src='${img_src}'`;
    } else if (Object.keys(obj).length != 1) {
      str = mergeStr(obj.img_id, obj);
    } else if (typeof img !== 'undefined') {
      img_src = imgAddress(img);
      str = ` img_src='${img_src}'`;
    } else {
      return ToolsService.fail('不能为空！');
    }
    const sqlstr = `UPDATE swiper set ${str} WHERE img_id=${obj.img_id}`;
    console.log(sqlstr);
    const data = await this.repository.query(sqlstr);
    if (typeof data === 'object') return '修改成功！';
    return '修改失败';
  }
  //添加
  async addSwiper(img, { img_type, img_desc }) {
    const img_src = imgAddress(img);
    const sqlstr = `insert into swiper (img_src,type,img_desc) 
    values('${img_src}','${img_type}','${img_desc}')`;
    const state = await this.repository.query(sqlstr);
    if (typeof state === 'undefined') return ToolsService.fail('插入失败');
    return '插入成功！';
  }

  //分类操作
  async getType() {
    const sql = `SELECT  id,type FROM type_nft`;
    const result = await this.repository.query(sql);
    if (typeof result === 'object') return result;
    return '失败了';
  }
  async changeType(obj) {
    console.log(obj);
    const str = mergeStr(obj.id, obj);
    const sqlstr = `UPDATE type_nft set ${str} WHERE id=${obj.id}`;
    console.log(sqlstr);
    const result = await this.repository.query(sqlstr);
    if (typeof result === 'object') return '修改成功！';
    return '修改失败!';
  }
  async addType({ type }) {
    const sql = `insert into type_nft
    (type)
    values('${type}')`;
    const result = await this.repository.query(sql);
    if (typeof result === 'object') return '插入成功！';
    return '插入失败!';
  }
}
