import { IsNotEmpty, IsString } from "class-validator";

export class BoardRequestDto{

    constructor(title: string, content: string){
        this._title = title;
        this._content = content;
    }
    
    @IsNotEmpty()
    @IsString()
    private _title: string;

    @IsString()
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