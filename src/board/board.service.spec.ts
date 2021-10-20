import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { BoardService } from './board.service';

// == MockBoardRepository start == //
class MockBoardRepository{
  private id: number = 1;
  private boards: Board[] = [];

  //repository find()메서드
  async find(){
    return this.boards;
  }
}

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: getRepositoryToken(Board),
          useClass: MockBoardRepository
        }
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
