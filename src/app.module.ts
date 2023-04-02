import { Module } from '@nestjs/common';
import { LoginModule } from '@/modules/login/login.module';
import { RegisterModule } from '@/modules/register/register.module';
import { HomeModule } from './modules/home/home.module';
import { AdminModule } from './modules/admin/admin.module';
import { NftModule } from './modules/nft/nft.module';
import { PersonalModule } from './modules/personal/personal.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RespondModule } from './modules/respond/respond.module';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthInterceptor } from './common/inteptors/transform.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ToolsService } from './common/utils/tools.service';
import { HttpExceptionFilter } from './common/filters/http-execption';
import { TasksModule } from './tasks/tasks.module';
@Module({
  imports: [
    //定时任务
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '101.35.251.18',
      port: 3306,
      username: 'ocean_mysql',
      password: 'admin',
      database: 'ocean_mysql',
      autoLoadEntities: true,
      synchronize: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
    }),
    ScheduleModule.forRoot(),
    //定时任务
    //TasksModule,
    //LoginModule,
    //RegisterModule,
    NftModule,
    //HomeModule,
    //AdminModule,
    //PersonalModule,
    RespondModule,
  ],
  providers: [
    //全局引入
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    ToolsService,
    // TasksService,
  ],
})
export class AppModule {}
