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
