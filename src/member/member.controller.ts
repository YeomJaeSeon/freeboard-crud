import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignyUpMemberDto } from './dto/signup_member.dto';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  //constructor DI
  constructor(private memberService: MemberService) {}

  //== signup ==//
  @Post('signup')
  @UsePipes(new ValidationPipe())
  signUp(@Body() memberDto: SignyUpMemberDto): Promise<string> {
    return this.memberService.signUp(memberDto);
  }
}
