import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/member/member.entity';
import { BOARD_DELETE_SUCCESS_MSG, NOT_FOUND_BOARD_MSG, UNAUTHORIZE_ACCESS_RESOURCE_MSG } from '../message/message';
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
    async getAllBoards(limit: number, offset: number): Promise<Board[]>{
        this.logger.debug(`limit : ${limit}`)
        this.logger.debug(`offset : ${offset}`)

        const foundBoards = await this.boardRepository.find({
            skip: (offset - 1) * limit,
            take: limit
        });

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

    //== delete == //
    async deleteBoard(
        id: number,
        member: Member
    ) : Promise<string>{
        //조회하고
        const foundBoard = await this.getBoardById(id);

        //check validate(자원에 접근하는 유저가 권한이 있는지)
        this.checkValidate(foundBoard, member);

        await this.boardRepository.delete(id);

        return BOARD_DELETE_SUCCESS_MSG;
    }

    // == update == //
    async updateBoard(
        boardId: number,
        member: Member,
        boardDto : BoardDto
    ) : Promise<Board>{
        const foundBoard = await this.getBoardById(boardId);

        //check validate(자원에 접근하는 유저가 권한이 있는지)
        this.checkValidate(foundBoard, member);

        const { title, content } = boardDto;

        //update data of board
        foundBoard.title = title;
        foundBoard.content = content;

        await this.boardRepository.save(foundBoard);

        return foundBoard;
    }

    private checkValidate(board : Board, member: Member) : void{
        if(board.member.id !== member.id){
            throw new UnauthorizedException(UNAUTHORIZE_ACCESS_RESOURCE_MSG);
        }
    }
}
