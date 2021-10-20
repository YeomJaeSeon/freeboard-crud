import { Board } from '../board/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { MemberSex } from './member.sex-enum';

@Entity()
@Unique(['email']) // email field unique constraint
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string; //email중복 허용 X

  @Column()
  age: number;

  @Column()
  sex: MemberSex;

  @Column()
  password: string;

  //연관관계 매핑 (Member : Board = 일대 다)
  @OneToMany(type => Board, board => board.member, {eager: false})
  boards: Board[];

  //== Member 객체 생성 메서드 ==//
  public static createMember(
    email: string,
    age: number,
    sex: MemberSex,
    password: string,
  ) {
    const member: Member = new Member();

    member.email = email;
    member.age = age;
    member.sex = sex;
    member.password = password;

    return member;
  }
}
