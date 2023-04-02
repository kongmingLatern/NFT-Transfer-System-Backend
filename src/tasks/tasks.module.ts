import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { DatabaseEntity } from '@/entities/Database.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([DatabaseEntity])],
  providers: [TasksService],
})
export class TasksModule {}
