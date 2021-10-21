import { IsNotEmpty, IsString } from "class-validator";
import { NOT_EMPTY_VALIDATION_MSG, STRING_FORMAT_VALIDATION_MSG } from "../../message/message";

export class BoardRequestDto{

    constructor(title: string, content: string){
        this._title = title;
        this._content = content;
    }
    
    @IsNotEmpty({
        message: NOT_EMPTY_VALIDATION_MSG
    })
    @IsString({
        message: STRING_FORMAT_VALIDATION_MSG
    })
    private _title: string;

    @IsString({
        message: STRING_FORMAT_VALIDATION_MSG
    })
    private _content: string;

    //title - getter
    public get title(): string{
        return this._title;
    }

    // - setter
    public set title(value : string){
        this._title = value;
    }

    //content - getter
    public get content(): string{
        return this._content;
    }

    //- setter
    public set content(value: string){
        this._content = value;
    }
}