import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches, Max,
  MaxLength, Min
} from 'class-validator';
import { SIGNUP_AGE_DTO_MAX_VALIDATION_MSG, SIGNUP_AGE_DTO_MIN_VALIDATION_MSG, SIGNUP_PASSWORD_DTO_MINLENGTH_REG_VALIDATION_MSG, SIGNUP_PASSWROD_DTO_MAXLENGTH_VALIDATION_MSG } from '../../message/message';
import { MemberSex } from '../member.sex-enum';

export class SignyUpMemberDto {
  constructor(email: string, age: number, sex: MemberSex, password: string){
    this._email = email;
    this._age = age;
    this._sex = sex;
    this._password = password;
  }

  @IsNotEmpty()
  @IsEmail()
  private _email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, {
    message: SIGNUP_AGE_DTO_MIN_VALIDATION_MSG
  })
  @Max(200, {
    message: SIGNUP_AGE_DTO_MAX_VALIDATION_MSG
  })
  private _age: number;

  @IsNotEmpty()
  @IsEnum(MemberSex) // request 값이 MemberSex Enum Value여야한다.
  private _sex: MemberSex;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: SIGNUP_PASSWORD_DTO_MINLENGTH_REG_VALIDATION_MSG
  })
  @MaxLength(15, {
    message: SIGNUP_PASSWROD_DTO_MAXLENGTH_VALIDATION_MSG
  })
  private _password: string;

  //email - getter
  public get email(): string{
    return this._email;
  }
  // - setter
  public set email(value: string){
    this._email = value;
  }

  //age - getter
  public get age(): number{
    return this._age;
  }

  // - setter
  public set age(value: number){
    this._age = value;
  }

  //sex - getter
  public get sex(): MemberSex{
    return this._sex;
  }
  //-setter
  public set sex(value: MemberSex){
    this._sex = value;
  }

  //password - getter
  public get password(): string{
    return this._password;
  }

  //-setter
  public set password(value: string){
    this._password = value;
  }
  
}
