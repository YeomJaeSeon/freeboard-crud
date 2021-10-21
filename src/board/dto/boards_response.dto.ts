import { Member } from "src/member/member.entity";
import { BoardResponseDto } from "./board_response.dto";

// 타입 정의
type DataType = {
    id : number,
    title: string,
    content: string,
    createdData: number,
    updatedData: number,
    member: Member
}

export class BoardsResponseDto{
    constructor(boardResponseDtos: BoardResponseDto[]){
        this.count = boardResponseDtos.length;
        
        boardResponseDtos.forEach(each => {
            const eachData: DataType = {
                id : each._data.id,
                title: each._data.title,
                content: each._data.content,
                createdData: each._data.createdData,
                updatedData: each._data.updatedData,
                member: each._data.member
            }

            this.data.push(eachData);
        })
    }

    private count: number;
    private data: DataType[] = []

    //count - getter
    public get _count(): number{
        return this.count;
    }

    // - setter
    public set _count(value : number){
        this.count = value;
    }

    //data - getter
    public get _data(): DataType[]{
        return this.data;
    }

    // - setter
    public set _data(value : DataType[]){
        this.data = value;
    }
}