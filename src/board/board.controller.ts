import { Body, Controller, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';

@Controller('board')
@UseGuards(AuthGuard()) //인증된 멤버만 BoardController에 요청가능
export class BoardController {
    private logger = new Logger('BoardController')

    //constructor DI
    constructor(
        private boardService: BoardService
    ){}

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(
        @Body() boardDto: BoardDto,
        @Req() req
        ): Promise<Board>{
        return this.boardService.createBoard(boardDto, req.user);
    }
}
