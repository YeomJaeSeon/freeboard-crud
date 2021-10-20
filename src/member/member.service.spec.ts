import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });
});
