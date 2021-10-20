import { Test, TestingModule } from '@nestjs/testing';
import { MemberDto } from './dto/member.dto';
import { Member } from './member.entity';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //== 단위 테스트 ==//
  //== 회원가입 테스트 ==//
  describe('signup test', () => {
    it('there should be 2 members', () => {
      //given
      // const memberDto : MemberDto = {name: '염재선', age}
      //when
      //then
    });
  });
});
