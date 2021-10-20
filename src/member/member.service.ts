import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ALREADY_EXISTED_NAME_MSG,
  SERVER_ERROR_MSG,
  SIGNUP_SUCCESS_MSG,
} from 'src/message/message';
import { MemberDto } from './dto/member.dto';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
  // memberRepository 생성자 주입
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository,
  ) {}

  //회원가입
  async signUp(memberDto: MemberDto): Promise<string> {
    const { name, age, sex, password } = memberDto;

    // 생성
    const newUser = this.memberRepository.create({
      name,
      age,
      sex,
      password,
    });

    try {
      //insert
      await this.memberRepository.save(newUser);
    } catch (err) {
      console.log(err);
      if (err.errno === 19) {
        throw new ConflictException(ALREADY_EXISTED_NAME_MSG); // unique constraint어김
      } else {
        throw new InternalServerErrorException(SERVER_ERROR_MSG);
      }
    }

    return SIGNUP_SUCCESS_MSG;
  }
}
