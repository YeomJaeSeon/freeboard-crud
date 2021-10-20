import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberController } from './member.controller';
import { Member } from './member.entity';
import { MemberService } from './member.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}), //passport 기본전략 : jwt를 사용할것.
    JwtModule.register({
      secret: 'mySecret', // 서버에서 유일하게 간직해야하는 secret - 요청온 jwt 토큰의 유효성을 위해
      signOptions : {
        expiresIn: 3600 // 토큰의 만료 기간 (1시간)
      }
    }),
    TypeOrmModule.forFeature([Member]) // member Repository imports in typeorm
  ], 
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
