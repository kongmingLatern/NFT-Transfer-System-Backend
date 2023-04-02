import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class DatabaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
