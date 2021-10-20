import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from 'src/member/member.module';
import { BoardController } from './board.controller';
import { Board } from './board.entity';
import { BoardService } from './board.service';

@Module({
  imports:[TypeOrmModule.forFeature([Board]), MemberModule],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}
