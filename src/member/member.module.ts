import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './member.controller';
import { MemberRepository } from './member.repository';
import { MemberService } from './member.service';

@Module({
  imports: [TypeOrmModule.forFeature([MemberRepository])], // memberRepository imports
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
