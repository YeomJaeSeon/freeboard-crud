import { MemberSex } from '../member.sex-enum';

export class MemberDto {
  name: string;
  age: number;
  sex: MemberSex;
  password: string;
}
