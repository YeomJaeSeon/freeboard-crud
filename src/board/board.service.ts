import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/member/member.entity';
import { BOARD_DELETE_SUCCESS_MSG, NOT_FOUND_BOARD_MSG, UNAUTHORIZE_ACCESS_RESOURCE_MSG } from '../message/message';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { BoardRequestDto } from './dto/board_request.dto';
import { BoardResponseDto } from './dto/board_response.dto';
import { BoardsResponseDto } from './dto/boards_response.dto';

@Injectable()
export class BoardService {
    private logger = new Logger('BoardService');

    //boardRepository constructor DI
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>
    ){}

    //== getBoardById == //
    async getBoardById(id: number): Promise<BoardResponseDto>{
        const foundBoard = await this.getOne(id);

        //entity -> response
        const boardResponseDto :BoardResponseDto = this.entityToBoardResponseDto(foundBoard);

        return boardResponseDto;
    }

    // == getAllBoards == //
    async getAllBoards(limit: number, offset: number): Promise<BoardsResponseDto>{
        this.logger.debug(`limit : ${limit}`)
        this.logger.debug(`offset : ${offset}`)

        const foundBoards = await this.boardRepository.find({
            skip: (offset - 1) * limit,
            take: limit
        });

        this.logger.debug(JSON.stringify(foundBoards))

        const boardsResponseDto = this.entityToBoardsResponseDto(foundBoards.map(each => this.entityToBoardResponseDto(each)))

        return boardsResponseDto;
    }

    //== Create == //
    async createBoard(
        boardDto: BoardRequestDto,
        member: Member
        ) : Promise<BoardResponseDto>{
        const {title, content} = boardDto;

        //board 생성 (member가 만든)
        const createdBoard = this.boardRepository.create({
            title,
            content,
            createdTime: Date.now(), //create createdTime
            member
        })

        await this.boardRepository.save(createdBoard);

        // entity -> dto
        const boardResponseDto :BoardResponseDto = this.entityToBoardResponseDto(createdBoard);

        //생성된 게시판 리턴
        return boardResponseDto;
    }

    //== delete == //
    async deleteBoard(
        id: number,
        member: Member
    ) : Promise<string>{
        //조회하고
        const foundBoard = await this.getOne(id);

        //check validate(자원에 접근하는 유저가 권한이 있는지)
        this.checkValidate(foundBoard, member);

        await this.boardRepository.delete(id);

        return BOARD_DELETE_SUCCESS_MSG;
    }

    // == update == //
    async updateBoard(
        boardId: number,
        member: Member,
        boardDto : BoardRequestDto
    ) : Promise<BoardResponseDto>{
        const foundBoard = await this.getOne(boardId);

        //check validate(자원에 접근하는 유저가 권한이 있는지)
        this.checkValidate(foundBoard, member);

        const { title, content } = boardDto;

        //update data of board
        foundBoard.title = title;
        foundBoard.content = content;
        foundBoard.updatedTime = Date.now(); // update updatedTime

        await this.boardRepository.save(foundBoard);

        // entity -> dto
        const boardResponseDto :BoardResponseDto = this.entityToBoardResponseDto(foundBoard);

        return boardResponseDto;
    }

    // ==  private methods == //

    // == check 인가 ==//
    private checkValidate(board : Board, member: Member) : void{
        if(board.member.id !== member.id){
            throw new UnauthorizedException(UNAUTHORIZE_ACCESS_RESOURCE_MSG);
        }
    }

    //== getOne - find()후, exception처리 메서드 ==//
    private async getOne(id: number): Promise<Board>{
        const foundBoard = await this.boardRepository.findOne(id);
        
        if(!foundBoard){
            throw new NotFoundException(NOT_FOUND_BOARD_MSG)
        }
        
        return foundBoard;
    }

    //entitiy to BoardResponseDto
    private entityToBoardResponseDto(board: Board): BoardResponseDto{
        const boardResponseDto :BoardResponseDto = new BoardResponseDto(
            board.id,
            board.title,
            board.content,
            board.createdTime,
            board.updatedTime,
            board.member
        )

        return boardResponseDto;
    }

    //entity to BoardsResponseDto
    private entityToBoardsResponseDto(boardResponseDtos: BoardResponseDto[]): BoardsResponseDto{
        // BoardResponseDto[] -> BoardsResponseDto
        const boardsResponseDto : BoardsResponseDto = new BoardsResponseDto(boardResponseDtos);

        return boardsResponseDto;
    }
}
