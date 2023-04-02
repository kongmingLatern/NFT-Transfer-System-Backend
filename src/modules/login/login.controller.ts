import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { AuthGuard } from '@nestjs/passport';
import { UseInterceptors } from '@nestjs/common';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  SubmitSevice(@Body() req) {
    return this.loginService.login(req.username);
  }
}
