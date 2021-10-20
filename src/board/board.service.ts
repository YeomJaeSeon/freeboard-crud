import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/member/member.entity';
import { NOT_FOUND_BOARD_MSG } from '../message/message';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { BoardDto } from './dto/board.dto';

@Injectable()
export class BoardService {
    private logger = new Logger('BoardService');

    //boardRepository constructor DI
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>
    ){}

    //== getBoardById == //
    async getBoardById(id: number): Promise<Board>{
        const foundBoard = await this.boardRepository.findOne(id);

        if(!foundBoard){
            throw new NotFoundException(NOT_FOUND_BOARD_MSG)
        }
        
        return foundBoard;
    }

    // == getAllBoards == //
    async getAllBoards(): Promise<Board[]>{
        const foundBoards = await this.boardRepository.find();

        return foundBoards;
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
