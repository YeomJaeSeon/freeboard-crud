import { Member } from "../../member/member.entity";

export class BoardResponseDto{
    constructor(id: number, title: string, content: string, createdTime: number, updatedTime: number, member: Member){
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdTime = createdTime;
        this.updatedTime = updatedTime;
        this.member = member;
    }
    private id: number;
    
    private title: string;

    private content: string;

    private createdTime: number;

    private updatedTime: number;

    private member: Member;

    //id - getter
    public get _id(): number{
        return this.id;
    }

    // - setter
    public set _id(value : number){
        this.id = value;
    }

    //title - getter
    public get _title(): string{
        return this.title;
    }

    // - setter
    public set _title(value : string){
        this.title = value;
    }

    //content - getter
    public get _content(): string{
        return this.content;
    }

    //- setter
    public set _content(value: string){
        this.content = value;
    }

    //createdTime - getter
    public get _createdTime(): number{
        return this.createdTime;
    }

    // - setter
    public set _createdTime(value : number){
        this.createdTime = value;
    }

    //updatedTime - getter
    public get _updatedTime(): number{
        return this.updatedTime;
    }

    // - setter
    public set _updatedTime(value : number){
        this.updatedTime = value;
    }

    //member - getter
    public get _member(): Member{
        return this.member;
    }

    // - setter
    public set _member(value : Member){
        this.member = value;
    }
}