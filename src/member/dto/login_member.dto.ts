import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { NOT_EMPTY_VALIDATION_MSG, EMAIL_FORMAT_VALIDATION_MSG, STRING_FORMAT_VALIDATION_MSG } from "../../message/message";

export class LoginMemberDto{

    constructor(email: string, password: string){
        this._email = email;
        this._password = password;
      }

    @IsNotEmpty({
        message: NOT_EMPTY_VALIDATION_MSG
    })
    @IsEmail({},{
        message: EMAIL_FORMAT_VALIDATION_MSG
    })
    private _email: string;

    @IsNotEmpty({
        message: NOT_EMPTY_VALIDATION_MSG
    })
    @IsString({
        message: STRING_FORMAT_VALIDATION_MSG
    })
    private _password: string;

    //email - getter
    public get email() : string{
        return this._email;
    }
    // - setter
    public set email(value: string){
        this._email = value;
    }

    //password - getter
    public get password(): string{
        return this._password;
    }

    //- setter
    public set password(value: string){
        this._password = value;
    }
}