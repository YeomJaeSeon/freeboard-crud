import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/member/member.entity';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { BoardDto } from './dto/board.dto';

@Injectable()
export class BoardService {
    //boardRepository constructor DI
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>
    ){}

    // == getAllBoards == //
    async getAllBoards(): Promise<Board[]>{
        const result = await this.boardRepository.find();

        return result;
    }

    //== Create == //
    async createBoard(
        boardDto: BoardDto,
        member: Member
        ) : Promise<Board>{
        const {title, content} = boardDto;

        //board 생성 (member가 만든)
        const createdBoard = this.boardRepository.create({
            title,
            content,
            member
        })

        await this.boardRepository.save(createdBoard);

        //생성된 게시판 리턴
        return createdBoard;
    }
}
