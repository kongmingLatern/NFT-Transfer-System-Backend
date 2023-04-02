import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { JwtService } from '@nestjs/jwt';
import md5 from 'md5';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(DatabaseEntity)
    private readonly repository: Repository<DatabaseEntity>,
    private jwtService: JwtService,
  ) {}
  async login(username) {
    const sqlstr = `update  users set status=1 where username='${username}'`;
    this.repository.query(sqlstr);
    const payload = { username: username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async validateUser(username, password) {
    //查看数据库有没有对应的账号
    const sqlstr = `select username,password from users where username=${username}`;
    const state = await this.repository.query(sqlstr);
    if (username === state[0].username || md5(password) === state[0].password) {
      return {
        ...state[0],
        state: true,
      };
    }
    return null;
  }
}
