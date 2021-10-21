import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { BoardRequestDto } from './dto/board_request.dto';
import { BoardResponseDto } from './dto/board_response.dto';
import { PaginationQueryDto } from './dto/pagination_query.dto';

/**
 * ***인증하지 않은(로그인 하지않은) 회원도 요청할수 있는 핸들러***
 * getAllBoards
 * getBoardById
 * 
 * ***인증한 회원(로그인 한)만 요청할수 있는 핸들러***
 * createBoard
 * deleteBoard -- service로직에서 인가 확인함. 
 * updateBoard -- service로직에서 인가 확인함.
 */

@Controller('boards')
//TODO: outputDto도 만들어보쟈
export class BoardController {
    private logger = new Logger('BoardController')

    //constructor DI
    constructor(
        private boardService: BoardService
    ){}

    // == getAllBoards는 pagination이 필수임 - offset - 1 부터 limit개의 데이터 응답
    @Get()
    @UsePipes(ValidationPipe)
    getAllBoards(
        @Query() query: PaginationQueryDto
    ) : Promise<BoardResponseDto[]>{
        this.logger.debug(`limit : ${query.limit}`)
        this.logger.debug(`offset : ${query.offset}`)

        return this.boardService.getAllBoards(query.limit, query.offset);
    }

    @Post()
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard()) //인증된 멤버만 create 요청가능
    createBoard(
        @Body() boardDto: BoardRequestDto,
        @Req() req
        ): Promise<BoardResponseDto>{
        return this.boardService.createBoard(boardDto, req.user);
    }

    @Get('/:id')
    getBoardById(
        @Param('id') id: number
    ) : Promise<BoardResponseDto>{
        this.logger.log('getBoardById')

        return this.boardService.getBoardById(id);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard()) //인증된 멤버만 delete 요청가능 - 인가는 service 로직에 있음
    deleteBoard(
        @Param('id') id: number,
        @Req() req        
    ): Promise<string>{
        return this.boardService.deleteBoard(id, req.user);
    }

    @Patch('/:id')
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard()) //인증된 멤버만 update 요청가능 - 인가는 service로직에 있음
    updateBoard(
        @Param('id') id : number,
        @Body() boardDto: BoardRequestDto,
        @Req() req
    ) : Promise<BoardResponseDto>{
        return this.boardService.updateBoard(id, req.user, boardDto)
    }
}
