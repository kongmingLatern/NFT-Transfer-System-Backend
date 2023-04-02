import { Injectable } from '@nestjs/common';
import { DatabaseEntity } from '@/entities/Database.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as md5 from 'md5';
import { ToolsService } from '@/common/utils/tools.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}
  async findUsername(username) {
    const sqlstr = `select username from users where username='${username}'`;
    const data = await this.repository.query(sqlstr);
    return data.length > 0 ? true : false;
  }
  async storeData({ username, password }, img: string) {
    const checkusername = await this.findUsername(username);
    console.log(checkusername);
    if (checkusername) return { message: '该用户已存在！！' };
    password = md5(password);
    img = img.replace(/\\/g, '/');
    img = 'http://localhost:3000/' + img.replace('public', 'static');
    const sqlstr = `insert into users (uid,face_img,username,password,remaining) values('${uuidv4()}','${img}','${username}','${password}',0)`;
    const state = await this.repository.query(sqlstr).then(() => {
      return true;
    });
    if (state) {
      const message = '成功';
      return { message };
    } else {
      const message = '失败';
      return { message };
    }
  }
}
