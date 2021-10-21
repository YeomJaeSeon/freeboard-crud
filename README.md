## 구현 방법 & 이유

### 기능

- Member module
  - 회원가입
    - 방법 : 회원가입에 필요한 간단한 데이터를 통해 회원가입 기능을 만듬(email, age, sex, password). 비밀번호는 요청이 들어온 비밀번호를 바로 db에 저장하지 않고 bcryptjs 라이브러리를 통해 salt + hash로 저장함, 그리고 email은 unique 제약조건을 줘 db내에 unique하게 존재하도록함. 또 sex 는 MemberSex enum을 이용함.
    - 이유 : 바로 비밀번호가 db에 저장이 되면 보안상 취약하므로 암호화 해서 db에 저장함, email을 통해 사용자를 유일하게 구분하기 위해(pk인 id도 있지만 어플리케이션 측면에서 중복된 이메일을 사용할순 없기에), enum을 사용한 이유는 'MALE', 'FEMALE'이라는 두 데이터 타입을 상수로써 존재하게 하기 위해
  - 로그인
    - 방법 : 이메일과 비밀번호로 로그인, 로그인을 하면 토큰(jwt - 로그인한 회원의 이메일과 만료기간을 넣은)을 응답한다. 그리고 요청이들어온 비밀번호는 암호화가 되어있지 않으므로 bcryptjs의 compare 함수를 통해 로그인, 그리고 passport라이브러리를 통해 jwt토큰을 헤더에 넣어서 오는 요청이 적절한지 판단하게함(요청의 어디부분에서 토큰이 오는지, secret과 같아서 적절한 토큰인지, 만료기간은 지나지 않았는지).
    - 이유 : 게시글의 Create, Update, Delete는 인증이 된 사용자만 접근하게 하고 싶음 그래서 인증기능이 필요했음. 만약 jwt을 사용하지 않는다면 해당 자원에 접근할때마다 로그인해야함. (이부분은 클라이언트에서 쿠키나 스토리지로 응답한 토큰을 가지고있어야함.) jwt와 passport는 이러한 인증을 쉽게 가능토록함. 또 Create, Update는 해당 게시글을 만든 사용자만 접근할수 있어야하므로 인가기능도 필요했음. jwt토큰 응답시 payload(jwt의)부분에 회원의 이메일을 넣고 응답하면 create나 update 접근시 요청 헤더에 jwt토큰(이메일 데이터가 있는)을 넣은 상태로 요청하기에, 서버에서는 토큰에서 필요한 이메일을 바로 꺼내서 해당 유저가 만든 게시글인지 확인하게함. 이렇게 jwt를 통해 간단하게 인증과 인가를 처리함. (그러므로 인증된 유저만 접근할수 있는 자원은 헤더에 로그인시 받은 토큰을 넣은 상태로 요청해야함.)
- Board module
  - Create
    - 방법 : 인증된 회원만 생성이 가능하게 함.
    - 이유 : 추후에 해당 게시글을 생성한 유저만 update, delete를 할수 있으므로 이를 위해서 로그인한 회원만 생성가능하게함
  - Read
    - 방법 : 하나만 읽을수도, pagination을 통해 여러개 읽을수 있음. 인증된 회원이 아니더라도 읽으수 있음
    - 이유 : 게시글을 볼 때 클릭해서 하나의 게시글만 보고싶을수 있으므로, 또 게시글 목록을 보기 위해선 페이징 기능을 통해 쉽게 목록들을 볼수 있어야 하므로. 인증이 되지않은 회원도 게시글목록이나 게시글을 읽을수 있게 한 이유는 자유로운 게시판으로 누구나 와서 읽을수 있는 게시판 웹어플리케이션을 생각했기 때문.
  - Update
    - 방법 : 인가된 회원만 수정가능.
    - 이유 : 누구나 게시글을 수정하면 안되닌까. 자신이 만든 게시글만 수정할수 있어야하므로.
  - Delete
    - 방법 : 인가된 회원만 삭제가능
    - 이유 : 누구나 게시글을 삭제하면 아무도 이 게시판을 이용하지 않을거라 생각했기에.. (물론 과제 요청사항이기도함.)

### 테스트

  - member service unit test
    - 방법 : mockMemberReposity 테스트파일 내에 만들어 테스트함.
    - 이유 : 직접 db에 요청해 데이터를 조회하거나 뽑아오며 하는 것이 단위테스트에는 어울리지 않다 생각하여 mockMemberReposity를 통해 테스트함.
  - board service unit test
    - 방법 : mockBoardRepsitory를 테스트파일 내에 만들어 테스트함.
    - 이유 : 위와 동일.

## 실행방법

- `npm i` -> `npm run start`로 실행

## api endpoint

- `POST : /member/signup`
  - 회원가입 요청
- `POST : /member/login`
  - 로그인 요청
- `POST : /boards`
  - 게시글 생성 요청
- `GET : /boards?limit={value}&offset={value}`
  - 게시글들 요청 (쿼리파라미터 값으로 페이징 적용)
- `GET : /boards/:id`
  - 해당 id의 게시글 요청
- `DELETE : /boards/:id`
  - 해당 id의 게시글 삭제 요청
- `PATCH : /boards/:id`
  - 해당 id의 게시글 수정 요청



## api 명세

- 회원가입
  - `localhost:3000/member/signup`
  - method : POST
  - request
    ```json
    {
      "email": "hello@naver.com",
      "age": 25,
      "sex": "MALE",
      "password": "abcd1234"
    }
    ```
  - response
    - 200
      ```text
      회원가입 성공
      ```
    - 400 (example)
      ```json
      {
        "statusCode": 400,
        "message": [
          "이메일 형식이어야 함"
          ],
        "error": "Bad Request"
      }
      ```

  - request validation
    ```text
    email : not empty, email형식
    age : not empty, number type, 1 ~ 200
    sex : not empty, 'FEMALE' or 'MALE'
    password : not empty, string type, 최소 8글자 최대 15글자, 숫자나 영어 포함되어야함
    ```
- 로그인
  - `localhost:3000/member/login`
  - method : POST
  - request
    ```json
    {
      "email": "box@naver.com",
      "password": "abcd1234"
    }
    ```
  - response
    - 200
      ```json
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJveEBuYXZlci5jb20iLCJpYXQiOjE2MzQ4MDM1NTksImV4cCI6MTYzNDgwNzE1OX0.Moxom-bNSVxvdwJyei625PULl9QBe7afAXhPpNKPQuc"
      }
      ```
    - 401
      ```json
      {
        "statusCode": 401,
        "message": "로그인 실패",
        "error": "Unauthorized"
      }
      ```
  - request validation
    ```text
    email : not empty, email형식
    password : not empty, string type
    ```
- 게시글 생성
  - (요청 헤더에 토큰 넣어야함)
  - `localhost:3000/boards`
  - method : POST
  - request
    ```json
    {
      "title": " 저녁 추천좀",
      "content": "가을이니 전어가 땡기네욤"
    }
    ```
  - response
    - 200
      ```json
      //생성된 데이터를 응답
      {
        "data": {
            "id": 19,
            "title": " 저녁 추천좀",
            "content": "가을이니 전어가 땡기네욤",
            "createdData": 1634804628440,
            "updatedData": null,
            "member": {
                "id": 8,
                "email": "box@naver.com",
                "age": 25,
                "sex": "MALE",
                "password": "$2a$10$KWXEGFNceFKZTHUS2nJ/CeCH0.J4.ZB9dqiLjP/8XFzl30wcRNNwC"
            }
        }
      }
      ```
    - 401
      ```json
      {
        "statusCode": 401,
        "message": "Unauthorized"
      }
      ```
    - 400
      ```json
      {
        "statusCode": 400,
        "message": [
            "string이어야 합니다.",
            "empty 값은 허용되지 않습니다."
        ],
        "error": "Bad Request"
      }
      ```
  - request validation
    ```text
    title : not empty, string type
    content : string type
    ```
- 게시글 모두 조회
  - `localhost:3000/boards?limit=5&offset=1` (imit, offset쿼리파라미터 필수, example : offset = 1, limit = 5)
  - method : GET
  - request
    ```
    없음
    ```
  - response
    - 200
      ```json
      {
        "data": [
            {
                "id": 1,
                "title": "요새 리버풀",
                "content": "잘하나요? - 예전이랑 비교좀",
                "createdData": 1634800371028,
                "updatedData": 1634800391858,
                "member": {
                    "id": 7,
                    "email": "robert@naver.com",
                    "age": 26,
                    "sex": "MALE",
                    "password": "$2a$10$fI.igk1Av1Q7zXuNXlrB7eeXhJ5vifodzpia1DNa4ncGZjDTE7aWy"
                }
            },
            {
                "id": 2,
                "title": "손 골봤나요",
                "content": "지리더라 ㄷ ㄷ ㄷ",
                "createdData": 1634800408741,
                "updatedData": null,
                "member": {
                    "id": 7,
                    "email": "robert@naver.com",
                    "age": 26,
                    "sex": "MALE",
                    "password": "$2a$10$fI.igk1Av1Q7zXuNXlrB7eeXhJ5vifodzpia1DNa4ncGZjDTE7aWy"
                }
            },
            {
                "id": 3,
                "title": "황소 감차",
                "content": "어케함.. 나도 배우고싶다",
                "createdData": 1634800425256,
                "updatedData": null,
                "member": {
                    "id": 7,
                    "email": "robert@naver.com",
                    "age": 26,
                    "sex": "MALE",
                    "password": "$2a$10$fI.igk1Av1Q7zXuNXlrB7eeXhJ5vifodzpia1DNa4ncGZjDTE7aWy"
                }
            }
        ],
        "count": 3
      }
      ```
    - 400
      ```json
      {
          "statusCode": 400,
          "message": [
              "offset쿼리 필수값입니다."
          ],
          "error": "Bad Request"
      }
      ```
  - request validation
    ```text
    없음
    ```
- 게시글 id로 조회
  - `localhost:3000/boards/3` (example : 3번 id로 조회)
  - method : GET
  - request
    ```text
    없음
    ```
  - response
    - 200
      ```json
      {
        "data": {
            "id": 3,
            "title": "황소 감차",
            "content": "어케함.. 나도 배우고싶다",
            "createdData": 1634800425256,
            "updatedData": null,
            "member": {
                "id": 7,
                "email": "robert@naver.com",
                "age": 26,
                "sex": "MALE",
                "password": "$2a$10$fI.igk1Av1Q7zXuNXlrB7eeXhJ5vifodzpia1DNa4ncGZjDTE7aWy"
            }
        }
      }
      ```
    - 404
      ```json
      {
        "statusCode": 404,
        "message": "해당 게시판은 존재하지 않음",
        "error": "Not Found"
      }
      ```
  - request validation
    ```text
    없음
    ```

- 게시글 삭제
  - (요청 헤더에 토큰 넣어야함)
  - `localhost:3000/boards/20` (example : id 20인 게시글 삭제)
  - method : DELETE
  - request
    ```text
    없음
    ```
  - response
    - 200
      ```text
      게시글 삭제 성공
      ```
    - 401
      ```json
      {
        "statusCode": 401,
        "message": "자원 접근 권한이 없음",
        "error": "Unauthorized"
      }
      ```
    - 404
      ```json
      {
          "statusCode": 404,
          "message": "해당 게시판은 존재하지 않음",
          "error": "Not Found"
      }
      ```
  - request validation
    ```text
    없음
    ```

- 게시글 수정
  - (요청 헤더에 토큰 넣어야함)
  - `localhost:3000/boards/19` (example : id 19인 게시글 수정)
  - method : PATCH  
  - request
    ```json
    //수정할 내용 요청
    {
        "title": "전어 추천좀(수정글)",
        "content": "ㅠㅠㅠ 급합니다 젭알.."
    }
    ```
  - response
    - 200
      ```json
      {
          "data": {
              "id": 19,
              "title": "전어 추천좀(수정글)",
              "content": "ㅠㅠㅠ 급합니다 젭알..",
              "createdData": 1634804628440,
              "updatedData": 1634811943864,
              "member": {
                  "id": 8,
                  "email": "box@naver.com",
                  "age": 25,
                  "sex": "MALE",
                  "password": "$2a$10$KWXEGFNceFKZTHUS2nJ/CeCH0.J4.ZB9dqiLjP/8XFzl30wcRNNwC"
              }
          }
      }
      ```
    - 400
      ```json
      {
          "statusCode": 400,
          "message": [
              "string이어야 합니다.",
              "empty 값은 허용되지 않습니다."
          ],
          "error": "Bad Request"
      }
      ```
    - 401
      ```json
      {
          "statusCode": 401,
          "message": "자원 접근 권한이 없음",
          "error": "Unauthorized"
      }
      ```
    - 404
      ```json
      {
        "statusCode": 401,
        "message": "자원 접근 권한이 없음",
        "error": "Unauthorized"
      }
      ```
  - request validation
    ```text
    title : not empty, string type
    content : string type
    ```
  


## dev - 고민들 & 해결
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
 
