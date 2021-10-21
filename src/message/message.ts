//== 200 ==//
export const SIGNUP_SUCCESS_MSG: string = '회원가입 성공';
export const BOARD_DELETE_SUCCESS_MSG: string = '게시글 삭제 성공';

//== 400 ==//
export const ALREADY_EXISTED_NAME_MSG: string = '이미 존재하는 회원 이름';
export const NOT_PROPER_REQUEST_MSG: string = '요청이 적절치 못한 데이터 형식';
export const UNAUTHORIZE_ACCESS_LOGIN_MSG: string = '로그인 실패'
export const UNAUTHORIZE_ACCESS_RESOURCE_MSG: string = '자원 접근 권한이 없음'

//== 404 ==//
export const NOT_FOUND_BOARD_MSG: string = '해당 게시판은 존재하지 않음'

//== 500 ==//
export const SERVER_ERROR_MSG: string = '서버 에러';

//== dto validation message == //
export const SIGNUP_PASSWORD_DTO_MINLENGTH_REG_VALIDATION_MSG : string = '최소 8글자이고, 숫자하나와 문자 하나가 포함되어야 합니다.'
export const SIGNUP_PASSWROD_DTO_MAXLENGTH_VALIDATION_MSG: string = '최대 15글자 입니다.'
export const SIGNUP_AGE_DTO_MIN_VALIDATION_MSG: string = '나이는 최소 1살입니다.'
export const SIGNUP_AGE_DTO_MAX_VALIDATION_MSG: string = '나이는 최대 200살입니다.'

export const PAGINATION_LIMIT_DTO_VALIDATION_MSG: string = 'limit쿼리 필수값입니다.';
export const PAGINATION_OFFSET_DTO_VALIDATION_MSG: string = 'offset쿼리 필수값입니다.';

export const NUMBER_FORMAT_VALIDATION_MSG: string = 'number이어야 합니다.'
export const NOT_EMPTY_VALIDATION_MSG: string = 'empty 값은 허용되지 않습니다.'
export const STRING_FORMAT_VALIDATION_MSG: string = 'string이어야 합니다.'
export const MEMBERSEX_ENUM_FORMAT_VALIDATION_MSG: string = "'FEMALE', 'MALE'중 하나로 요청해야합니다."
export const EMAIL_FORMAT_VALIDATION_MSG: string = '이메일 형식이어야 함'
