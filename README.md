## dev
- [x] board CRUD 접근 모드 로그인을 해야할까?
  - CUD만 로그인(인증)을 한 유저만 
접근 가능하게 
접근 가능하게 하고
Read는 
로그인을 하지 
로그인을 하지 않은 유저도 
로그인을 하지 않은 유저도 접근할수 
있도록하자.

  - useGuard레벨을 
컨트롤러에서 
컨트롤러에서 핸들러로 
내림.

- [x] unit테스트인데 
db에 
접근해서 
접근해서 직접 
접근해서 직접 데이터를 
접근해서 직접 데이터를 넣거나 
접근해서 직접 데이터를 넣거나 가져와야하나?

  - spec.ts(test)파일 
내에 
MockRepository객체를 만들어 
typeorm에서 
제공하는 
제공하는 메서드들을 
제공하는 메서드들을 커스텀하게 
구현함

  - test시 
내가만든 
mockRepository의 메서드가 호출되어 db에 접근 이루어지지않게 변경.

- [x] request dto enum validation 체크
  - class-validator 의 `@IsEnum()` 데코레이터를 통해 요청 데이터 유효성 체크
- [x] use jwtModule in test
  - testing module에서도 jwtModule import를 해줘야 사용가능
```typescript
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      //testing module에도 똑같이 JwtModule을 넣어줘야 test에서 사용가능
      imports: [
        JwtModule.register({
          secret: {secret}, 
          signOptions : {
          expiresIn: {expireTimes} 
        }
      }),
      ],
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Member),
          useClass: MockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    jwtService = module.get<JwtService>(JwtService);
  });
```
- [x] board entity를 바로 응답하기 보단 dto로 변환해서 응답하고싶다.. service로직에서 entity를 dto로 바꿀까, controller에서 바꿀까?
  - service에서 entity를 dto로 바꿈
  - 별도의 private메서드를 통해서 변경
  - getBoardById라는 메서드를 통해 하나의 board 아이템 조회하고 예외처리하는 로직은 getOne이라는 메서드를 만들어 분리함. - deleteBoard, updateBoard에선 getBoardById 메서드를 의존하는게 아닌 getOne메서드를 의존하는 것으로 변경

- [x] borard response dto를 그냥, board entity의 데이터만 옮겨서 쓰는것보단, 좀더 가공하는데 어떻게가공할까. boardResponseDto, boardsResponseDto두개를 만들어서 게시판 데이터 getBoardById로 응답할 때랑 getAllBoards로 응답할때랑 다른 형식으로 할까? 아니면 그냥 boardResponseDto 타입 하나를 통해서 data : {BoardResponseDto},혹은 count : {number}, data : [{BoardResponseDto}, ... ]}로 응답할까?
  - 전자 선택, 후자는 dto로 바꾸는 것과, typescript의 타입체크가 더러워질거같아, 그냥 boardResponseDto, 와 boardsResponseDto를 만들었음
 
