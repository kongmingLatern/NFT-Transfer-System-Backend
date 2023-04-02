import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonalService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}
  getInformation(uid) {
    const sqlstr = `select username,signature,avatar, from users where uid=${uid}`;
    const data = this.repository.query(sqlstr);
    return data;
  }

  async changeUser(imgsrc, userobj) {
    imgsrc = imgsrc.replace(/\\/g, '/');
    const face_img =
      'http://localhost:3000/' + imgsrc.replace('public', 'static');
    userobj.avatar = face_img;
    let str = '';
    Object.keys(userobj).map((item) => {
      if (item !== 'uid') str += item + "= '" + userobj[item] + "',";
    });
    str = str.slice(0, -1);
    const sqlstr = `UPDATE users set ${str} WHERE uid=${userobj.uid}`;
    console.log(sqlstr);
    const data = await this.repository.query(sqlstr);
    return data;
  }
}
