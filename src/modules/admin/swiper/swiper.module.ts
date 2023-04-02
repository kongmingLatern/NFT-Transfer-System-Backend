import { Module } from '@nestjs/common';
import { SwiperController } from './swiper.controller';
import { SwiperService } from './swiper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
@Module({
  imports: [
    TypeOrmModule.forFeature([DatabaseEntity]),
    MulterModule.register({
      // 用于配置上传，这部分也可以写在路由上
      storage: diskStorage({
        destination: join('./public/swiper'),
        filename: (_, file, callback) => {
          const fileName = `${
            new Date().getTime() + extname(file.originalname)
          }`;
          return callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [SwiperController],
  providers: [SwiperService],
})
export class SwiperModule {}
