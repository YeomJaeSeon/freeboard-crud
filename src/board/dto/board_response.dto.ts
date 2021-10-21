import { Member } from "../../member/member.entity";

// 타입 정의
type DataType = {
    id : number,
    title: string,
    content: string,
    createdData: number,
    updatedData: number,
    member: Member
}

export class BoardResponseDto{
    constructor(id: number, title: string, content: string, createdTime: number, updatedTime: number, member: Member){
        this.data = {
            id,
            title,
            content,
            createdData : createdTime,
            updatedData : updatedTime,
            member
        };
    }
    private data : DataType

    //data - getter
    public get _data(): DataType{
        return this.data;
    }

    // - setter
    public set _data(value : DataType){
        this.data = value;
    }
}