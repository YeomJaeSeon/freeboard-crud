import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginMemberDto{
    //TODO: private getter setter
    @IsNotEmpty()
    @IsEmail()
    private _email: string;

    @IsNotEmpty()
    @IsString()
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