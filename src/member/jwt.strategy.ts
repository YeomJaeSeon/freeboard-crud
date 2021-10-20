import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UNAUTHORIZE_ACCESS_LOGIN_MSG } from "../message/message";
import { Repository } from "typeorm";
import { Member } from "./member.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){ //jwt를 기본전략으로 사용하는 Passport 전략사용
    constructor(
        @InjectRepository(Member)
        private memberRepository : Repository<Member>
    ){
        super({
            secretOrKey: 'mySecret',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // request 할때 헤더에 토큰이 달려오기에
            // 어디에서 jwt토큰을 받아올지를 적는부분
          });
    }

    async validate(payload) {
        const { email } = payload; //payload에서 꺼낸 로그인한 유저의 email
        const member: Member = await this.memberRepository.findOne({ email }); //email로 select
    
        if (!member) {
            //jwt의 만료일자
          throw new UnauthorizedException(UNAUTHORIZE_ACCESS_LOGIN_MSG);
        }
    
        //유효하면 member객체 넣어서 요청
        return member;
      }

}