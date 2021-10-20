import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MemberSex } from '../member/member.sex-enum';
import { Member } from '../member/member.entity';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';

// == MockBoardRepository start == //
class MockBoardRepository{
  private id: number = 1;
  private boards: Board[] = [];

  //repository find()메서드
  async find(){
    return this.boards;
  }

  //repository create()메서드
  create({title, content, member} : {title: string, content: string, member: Member}) : Board{
    const newBoard: Board = Board.createBoard(title, content, member);

    return newBoard;
  }

  //repository save()메서드
  async save(board: Board){
    board.id = ++this.id;
    this.boards.push(board);
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

  // == findAllBoards test ==//
  describe('findAllBoards test', () => {
    it('모든 게시물 조회', async () => {
      //given
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      const boardDto1 : BoardDto = new BoardDto('1 게시물입니당!', '갑자기 날씨가 넘 추워111');
      const boardDto2 : BoardDto = new BoardDto('2 게시물입니당!', '갑자기 날씨가 넘 추워222');
      const boardDto3 : BoardDto = new BoardDto('3 게시물입니당!', '갑자기 날씨가 넘 추워333');
      const boardDto4 : BoardDto = new BoardDto('4 게시물입니당!', '갑자기 날씨가 넘 추워444');
      const boardDto5 : BoardDto = new BoardDto('5 게시물입니당!', '갑자기 날씨가 넘 추워555');

      service.createBoard(boardDto1, member);
      service.createBoard(boardDto2, member);
      service.createBoard(boardDto3, member);
      service.createBoard(boardDto4, member);
      service.createBoard(boardDto5, member);

      //when
      const result = await service.getAllBoards();

      //then
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(5);
    })
  })

  //== creatBoard test == //
  describe('createBoard test', () => {
    it('게시물 생성 성공', async () => {
      //given
      const boardDto : BoardDto = new BoardDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');

      //when
      const resultBoard :Board = await service.createBoard(boardDto, member);
      
      //then
      expect(resultBoard.title).toEqual('첫 게시물입니당!');
      expect(resultBoard.content).toEqual('갑자기 날씨가 넘 추워')
      expect(resultBoard.member).toEqual(member);
    })
    it('한 회원이 게시물 세개 생성', async () => {
      //given
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      const boardDto1 : BoardDto = new BoardDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const boardDto2 : BoardDto = new BoardDto('두번째 게시물입니당!', '감기걸림 ㅠ;;');
      const boardDto3 : BoardDto = new BoardDto('마지막 게시물입니당!', '그래서 전기장판삼 ㅇㅇ;;');

      //when
      service.createBoard(boardDto1, member);
      service.createBoard(boardDto2, member);
      service.createBoard(boardDto3, member);
      const result = await service.getAllBoards();

      //then
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(3);
    })
  })
});
