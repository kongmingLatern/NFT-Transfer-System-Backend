import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseEntity } from '@/entities/Database.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DatabaseEntity])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
