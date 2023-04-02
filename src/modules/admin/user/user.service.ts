import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { mergeStr } from '@/common/config/merge';
import * as md5 from 'md5';
import { ToolsService } from '@/common/utils/tools.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
  ) {}

  async findAll() {
    const sqlstr = 'select uid,username,password,remaining from users';
    const result = await this.repository.query(sqlstr);
    if (typeof result !== 'object') ToolsService.fail('请求失败');
    return result;
  }

  async changeUser(obj) {
    if (typeof obj.password !== 'undefined') obj.password = md5(obj.password);

    const str = mergeStr(obj.uid, obj);
    const sqlstr = `UPDATE users set ${str} WHERE uid='${obj.uid}'`;

    const result = await this.repository.query(sqlstr);
    if (typeof result !== 'object') ToolsService.fail('请求失败');
    return '修改成功！！';
  }
  /**
   * 删除成功
   */
  removeUser(uid) {
    const sqlstr = `delete from users where uid='${uid}'`;
    const result = this.repository.query(sqlstr);
    if (typeof result !== 'object') ToolsService.fail('请求失败');
    return '删除成功！！';
  }
}
