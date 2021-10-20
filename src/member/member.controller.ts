import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MemberDto } from './dto/member.dto';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  //constructor DI
  constructor(private memberService: MemberService) {}

  //== signup ==//
  @Post('signup')
  @UsePipes(new ValidationPipe())
  signUp(@Body() memberDto: MemberDto): Promise<string> {
    return this.memberService.signUp(memberDto);
  }
}
