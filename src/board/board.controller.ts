import { Body, Controller, Get, Logger, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';

@Controller('boards')
@UseGuards(AuthGuard()) //인증된 멤버만 BoardController에 요청가능
export class BoardController {
    private logger = new Logger('BoardController')

    //constructor DI
    constructor(
        private boardService: BoardService
    ){}

    @Get()
    getAllBoards() : Promise<Board[]>{
        return this.boardService.getAllBoards();
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
}
