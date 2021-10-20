import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ALREADY_EXISTED_NAME_MSG,
  SERVER_ERROR_MSG,
  SIGNUP_SUCCESS_MSG,
} from '../message/message';
import { SignyUpMemberDto } from './dto/member.dto';
import { Member } from './member.entity';

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

    // Member 객체 생성
    const member = Member.createMember(email, age, sex, password)

    const newUser = this.memberRepository.create(member);

    try {
      //insert
      await this.memberRepository.save(newUser);
    } catch (err) {
      if (err.errno === 19) {
        throw new ConflictException(ALREADY_EXISTED_NAME_MSG); // unique constraint어김
      } else {
        throw new InternalServerErrorException(SERVER_ERROR_MSG);
      }
    }

    return SIGNUP_SUCCESS_MSG;
  }

}
