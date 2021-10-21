import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';

@Controller('boards')
@UseGuards(AuthGuard()) //인증된 멤버만 BoardController에 요청가능
//TODO: getAllBoards라던가 getBoardById등은 꼭 로그인해야 볼수있나? - 생각
//TODO: board의 필드 더 추가(생성 시간, 수정시간등등..)
//TODO: memberDto, boardDto - 정규식등 좀더 강화해보자.
//TODO: getAllBoards의 pagination도 해결해보자.
//TODO: outputDto도 만들어보쟈
export class BoardController {
    private logger = new Logger('BoardController')

    //constructor DI
    constructor(
        private boardService: BoardService
    ){}

    // == getAllBoards는 pagination이 필수임 - offset - 1 부터 limit개의 데이터 응답
    @Get()
    getAllBoards(
        @Query('limit', ParseIntPipe) limit: number,
        @Query('offset', ParseIntPipe) offset: number
    ) : Promise<Board[]>{
        this.logger.debug(`limit : ${limit}`)
        this.logger.debug(`offset : ${offset}`)
        return this.boardService.getAllBoards(limit, offset);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(
        @Body() boardDto: BoardDto,
        @Req() req
        ): Promise<Board>{
        return this.boardService.createBoard(boardDto, req.user);
    }

    @Get('/:id')
    getBoardById(
        @Param('id') id: number
    ) : Promise<Board>{
        this.logger.log('getBoardById')
        return this.boardService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(
        @Param('id') id: number,
        @Req() req        
    ): Promise<string>{
        return this.boardService.deleteBoard(id, req.user);
    }

    @Patch('/:id')
    @UsePipes(ValidationPipe)
    updateBoard(
        @Param('id') id : number,
        @Body() boardDto: BoardDto,
        @Req() req
    ) : Promise<Board>{
        return this.boardService.updateBoard(id, req.user, boardDto)
    }
}
