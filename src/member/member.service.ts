import {
  ConflictException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ALREADY_EXISTED_NAME_MSG,
  SERVER_ERROR_MSG,
  SIGNUP_SUCCESS_MSG
} from '../message/message';
import { LoginMemberDto } from './dto/login_member.dto';
import { SignyUpMemberDto } from './dto/signup_member.dto';
import { Member } from './member.entity';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class MemberService {
  // memberRepository 생성자 주입
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  //==모든 멤버 조회 ==//
  async findAllMembers(): Promise<Member[]> {
    const members = await this.memberRepository.find();

    return members;
  }

  //==회원가입 ==//
  async signUp(memberDto: SignyUpMemberDto): Promise<string> {
    const { email, age, sex, password } = memberDto;

    const salt = await bcrypt.genSalt(); //salt 추가
    const encodedPwd = await bcrypt.hash(password, salt); //password + salt - string hash

    // Member 객체 생성
    const member = Member.createMember(email, age, sex, encodedPwd) // encoded pwd를 통해 Member 생성

    const newMember = this.memberRepository.create(member);

    try {
      //insert
      await this.memberRepository.save(newMember);
    } catch (err) {
      if (err.errno === 19) {
        throw new ConflictException(ALREADY_EXISTED_NAME_MSG); // unique constraint어김
      } else {
        throw new InternalServerErrorException(SERVER_ERROR_MSG);
      }
    }

    return SIGNUP_SUCCESS_MSG;
  }

  //== 로그인 == //
  // async signIn(memberDto : LoginMemberDto): Promise<{accessToken : string}>{
  //   const {email, password} = memberDto;
  //   const loginMember = this.memberRepository.findOne({ email }); //이메일로 select

  // }

}
