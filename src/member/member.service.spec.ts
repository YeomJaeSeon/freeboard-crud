import { ConflictException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import {
  ALREADY_EXISTED_NAME_MSG, SIGNUP_SUCCESS_MSG
} from '../message/message';
import { SignyUpMemberDto } from './dto/signup_member.dto';
import { Member } from './member.entity';
import { MemberService } from './member.service';
import { MemberSex } from './member.sex-enum';

// == MockMemberRepository start == //
class MockMemberRepository {
  private id: number = 1;
  private members: Member[] = [];

  //repository find()메서드
  async find() {
    return this.members;
  }

  //repository create()메서드
  create({ email, age, sex, password }: {
    email: string;
    age: number;
    sex: MemberSex;
    password: string;
  }): Member {
    const newMember: Member = Member.createMember(email, age, sex, password);

    return newMember;
  }

  //repository save()메서드
  async save(member: Member) {
    if(this.members.find(each => each.email === member.email)){
      //이미 존재하는 이메일이 있다면 - email unique constraint에 대응되는 조건
      //constraint때매 발생하는 똑같은 예외를 발생한다.
      throw new QueryFailedError('INSERT INTO "member"("id", "email", "age", "sex", "password") VALUES (NULL, ?, ?, ?, ?)',
      [member.email, member.age, member.sex, member.password], {
        errno: 19,
        code: 'SQLITE_CONSTRAINT'
      });
    }
    
    member.id = this.id++;
    this.members.push(member);
  }
} // == MockMemberRepository end ==//

describe('MemberService', () => {
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      //testing module에도 똑같이 JwtModule을 넣어줘야 test에서 사용가능
      imports: [
        JwtModule.register({
          secret: 'mySecret', 
          signOptions : {
          expiresIn: 3600 
        }
      }),
      ],
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Member),
          useClass: MockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  //== findAllMembers test ==//
  describe('findAllMembers test', () => {
    it('존재하는 모든 멤버 조회', async () => {
      //when
      const result = await service.findAllMembers();

      //then
      expect(result.length).toEqual(0);
    });
  });

  describe('signup test', () => {
    it('회원가입', async () => {
      //given
      const memberDto: SignyUpMemberDto = new SignyUpMemberDto(
        'a@naver.com', 20 ,MemberSex.FEMALE, '1234'
      );

      //when
      const successMsg = await service.signUp(memberDto);
      const result = await service.findAllMembers();

      //then
      expect(successMsg).toEqual(SIGNUP_SUCCESS_MSG);
      expect(result.length).toEqual(1);
    });

    it('회원가입 3명', async () => {
      //given
      const memberDto1: SignyUpMemberDto = new SignyUpMemberDto(
        'a@naver.com', 20 ,MemberSex.FEMALE, '1234'
      );

      const memberDto2: SignyUpMemberDto = new SignyUpMemberDto(
        'b@naver.com', 20 ,MemberSex.FEMALE, '1234'
      );

      const memberDto3: SignyUpMemberDto = new SignyUpMemberDto(
        'c@naver.com', 20 ,MemberSex.FEMALE, '1234'
      );

      //when
      await service.signUp(memberDto1);
      await service.signUp(memberDto2);
      await service.signUp(memberDto3);

      const result = await service.findAllMembers();

      //then
      expect(result.length).toEqual(3);
    });
    it('회원가입 실패_중복 email', async () => {
      //given
      const memberDto: SignyUpMemberDto = new SignyUpMemberDto(
        'a@naver.com', 20 ,MemberSex.FEMALE, '1234'
      );

      await service.signUp(memberDto);

      //when
      const duplicateMemberDto: SignyUpMemberDto = new SignyUpMemberDto(
        'a@naver.com', 20 ,MemberSex.FEMALE, '1234'
      );

      //then
      try {
        await service.signUp(duplicateMemberDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException)
        expect(err.message).toEqual(ALREADY_EXISTED_NAME_MSG)
      }
    });
    
  });
});
