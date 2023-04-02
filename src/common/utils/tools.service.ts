import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ToolsService {
  static fail(mes, code = HttpStatus.BAD_REQUEST) {
    throw new HttpException(
      {
        message: '请求失败',
        error: mes,
      },
      code,
    );
  }
}
