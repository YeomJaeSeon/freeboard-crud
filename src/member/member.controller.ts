import {
  Body,
  Controller, Post, UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { LoginMemberDto } from './dto/login_member.dto';
import { SignyUpMemberDto } from './dto/signup_member.dto';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  //constructor DI
  constructor(private memberService: MemberService) {}

  //== signup ==//
  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() memberDto: SignyUpMemberDto): Promise<string> {
    return this.memberService.signUp(memberDto);
  }

  //== login ==//
  @Post('/login')
  @UsePipes(ValidationPipe)
  login(@Body() memberDto: LoginMemberDto): Promise<{token : string}>{
    return this.memberService.login(memberDto);
  }
}
