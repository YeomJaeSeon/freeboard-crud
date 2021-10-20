import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
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
  private _age: number;

  @IsNotEmpty()
  @IsEnum(MemberSex) // request 값이 MemberSex Enum Value여야한다.
  private _sex: MemberSex;

  @IsNotEmpty()
  @IsString()
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
