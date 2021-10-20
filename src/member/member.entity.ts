import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { MemberSex } from './member.sex-enum';

@Entity()
@Unique(['name']) // name filed unique constraint
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; //name중복 허용 X

  @Column()
  age: number;

  @Column()
  sex: MemberSex;

  @Column()
  password: string;
}
