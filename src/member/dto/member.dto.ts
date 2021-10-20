import {
  IsEmail,
  isEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { MemberSex } from '../member.sex-enum';

export class MemberDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsEnum(MemberSex) // request 값이 MemberSex Enum Value여야한다.
  sex: MemberSex;

  @IsNotEmpty()
  @IsString()
  password: string;
}
