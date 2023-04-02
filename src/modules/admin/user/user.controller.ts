import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/selectAll/user')
  //得到所有用户
  async getAlluser() {
    return await this.userService.findAll();
  }
  //修改
  @Put('/change/user')
  changeUser(@Body() obj): object {
    return this.userService.changeUser(obj);
  }
  @Delete('/delete/user')
  deleteUser(@Body() { uid }) {
    return this.userService.removeUser(uid);
  }
}
