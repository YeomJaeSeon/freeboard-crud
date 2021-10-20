import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberController } from './member.controller';
import { Member } from './member.entity';
import { MemberService } from './member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])], // member Repository imports in typeorm
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
