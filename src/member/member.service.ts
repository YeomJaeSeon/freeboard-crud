import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ALREADY_EXISTED_NAME_MSG,
  SERVER_ERROR_MSG,
  SIGNUP_SUCCESS_MSG,
  UNAUTHORIZE_ACCESS_MSG
} from '../message/message';
import { LoginMemberDto } from './dto/login_member.dto';
import { SignyUpMemberDto } from './dto/signup_member.dto';
import { Member } from './member.entity';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MemberService {
  // memberRepository 생성자 주입
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private jwtService: JwtService // JWT사용을 위한 DI
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
  async login(memberDto : LoginMemberDto): Promise<{token : string}>{
    const {email, password} = memberDto;
    const loginMember = this.memberRepository.findOne({ email }); //이메일로 select

    if(loginMember && (await bcrypt.compare(password, (await loginMember).password))){
      //로그인한 멤버가있고, bcryptjs 모듈을 통해 요청온 pwd와 select된 멤버의 비밀번호가 같으면

      const payload = { email }; // jwt paylaod에 회원의 이메일을 넣는다. - 헤더에 요청온 토큰을 통해 유저의 데이터를 select하기 위해
      const token = await this.jwtService.sign(payload); //member module에서 설정한 secret이 알아서 합쳐져서 토큰이 생성된다.

      return { token };
    }else throw new UnauthorizedException(UNAUTHORIZE_ACCESS_MSG)
  }

}
