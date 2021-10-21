import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MemberSex } from '../member/member.sex-enum';
import { Member } from '../member/member.entity';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BOARD_DELETE_SUCCESS_MSG, NOT_FOUND_BOARD_MSG, UNAUTHORIZE_ACCESS_DELETE_MSG } from '../message/message';

// == MockBoardRepository start == //
class MockBoardRepository{
  private id: number = 1;
  private boards: Board[] = [];

  //repository find()메서드
  async find(){
    return this.boards;
  }

  //repository findOne()메서드
  async findOne(id: number){
    return this.boards.find(each => each.id === id);
  }

  //repository create()메서드
  create({title, content, member} : {title: string, content: string, member: Member}) : Board{
    const newBoard: Board = Board.createBoard(title, content, member);

    return newBoard;
  }

  //repository save()메서드
  async save(board: Board){
    board.id = this.id++;
    this.boards.push(board);
  }

  //repository delete()메서드
  async delete(id: number){
    this.boards = this.boards.filter(each => each.id !== id);
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
 
  //== getBoardById test ==//
  describe('getBoardById test', () => {
    it('id로 게시판 조회 - 게시판 있음', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      
      const boardDto1 : BoardDto = new BoardDto('1 게시물입니당!', '갑자기 날씨가 넘 추워111');
      const boardDto2 : BoardDto = new BoardDto('2 게시물입니당!', '갑자기 날씨가 넘 추워222');
      const boardDto3 : BoardDto = new BoardDto('3 게시물입니당!', '갑자기 날씨가 넘 추워333');
      const boardDto4 : BoardDto = new BoardDto('4 게시물입니당!', '갑자기 날씨가 넘 추워444');
      const boardDto5 : BoardDto = new BoardDto('5 게시물입니당!', '갑자기 날씨가 넘 추워555');
      
      await service.createBoard(boardDto1, member);
      await service.createBoard(boardDto2, member);
      await service.createBoard(boardDto3, member);
      await service.createBoard(boardDto4, member);
      await service.createBoard(boardDto5, member);

      const id: number = 1;

      //when
      const resultBoard = await service.getBoardById(id);

      //then
      expect(resultBoard).toBeInstanceOf(Board);
      expect(resultBoard.title).toEqual('1 게시물입니당!')
      expect(resultBoard.content).toEqual('갑자기 날씨가 넘 추워111')
    })
    it('id로 게시판 조회 - 게시판 없음', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      
      const boardDto1 : BoardDto = new BoardDto('1 게시물입니당!', '갑자기 날씨가 넘 추워111');
      const boardDto2 : BoardDto = new BoardDto('2 게시물입니당!', '갑자기 날씨가 넘 추워222');
      const boardDto3 : BoardDto = new BoardDto('3 게시물입니당!', '갑자기 날씨가 넘 추워333');
      const boardDto4 : BoardDto = new BoardDto('4 게시물입니당!', '갑자기 날씨가 넘 추워444');
      const boardDto5 : BoardDto = new BoardDto('5 게시물입니당!', '갑자기 날씨가 넘 추워555');

      await service.createBoard(boardDto1, member);
      await service.createBoard(boardDto2, member);
      await service.createBoard(boardDto3, member);
      await service.createBoard(boardDto4, member);
      await service.createBoard(boardDto5, member);

      //when - 없는 게시판 조회시
      const id: number = 999; 

      //then
      await expect(service.getBoardById(id)).rejects.toThrow(
        new NotFoundException(NOT_FOUND_BOARD_MSG)
      ) 
    })
  })

  // == findAllBoards test ==//
  describe('findAllBoards test', () => {
    it('모든 게시물 조회', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId
      
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
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      //when
      const resultBoard :Board = await service.createBoard(boardDto, member);
      
      //then
      expect(resultBoard.title).toEqual('첫 게시물입니당!');
      expect(resultBoard.content).toEqual('갑자기 날씨가 넘 추워')
      expect(resultBoard.member).toEqual(member);
    })
    it('한 회원이 게시물 세개 생성', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
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

  //== deleteBoard test ==//
  describe('deleteBoard test', () => {
    it('게시글 삭제', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      
      const boardDto1 : BoardDto = new BoardDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const boardDto2 : BoardDto = new BoardDto('두번째 게시물입니당!', '감기걸림 ㅠ;;');
      const boardDto3 : BoardDto = new BoardDto('마지막 게시물입니당!', '그래서 전기장판삼 ㅇㅇ;;');

      await service.createBoard(boardDto1, member);
      await service.createBoard(boardDto2, member);
      await service.createBoard(boardDto3, member);

      const boardId:number = 2; //두번째 게시글 삭제해보자

      //when
      const msg = await service.deleteBoard(boardId, member);
      const result = await service.getAllBoards();

      //then
      expect(msg).toEqual(BOARD_DELETE_SUCCESS_MSG);
      expect(result.length).toEqual(2);
    })

    it('게시글 삭제 - 없는 게시글 예외발생', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      
      const boardDto1 : BoardDto = new BoardDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const boardDto2 : BoardDto = new BoardDto('두번째 게시물입니당!', '감기걸림 ㅠ;;');
      const boardDto3 : BoardDto = new BoardDto('마지막 게시물입니당!', '그래서 전기장판삼 ㅇㅇ;;');

      await service.createBoard(boardDto1, member);
      await service.createBoard(boardDto2, member);
      await service.createBoard(boardDto3, member);

      //when - 없는 게시판 삭제하려할 시
      const boardId:number = 100; //100 id의 게시글 삭제해보자

      //then
      await expect(service.deleteBoard(boardId, member)).rejects.toThrow(
        new UnauthorizedException(NOT_FOUND_BOARD_MSG)
      ) 
    })

    it('게시글 삭제 - 권한이 없어서 삭제 거부', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      
      const boardDto1 : BoardDto = new BoardDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const boardDto2 : BoardDto = new BoardDto('두번째 게시물입니당!', '감기걸림 ㅠ;;');
      const boardDto3 : BoardDto = new BoardDto('마지막 게시물입니당!', '그래서 전기장판삼 ㅇㅇ;;');

      await service.createBoard(boardDto1, member);
      await service.createBoard(boardDto2, member);
      await service.createBoard(boardDto3, member);

      const boardId:number = 2; // 2 id의 게시글 삭제해보자

      //when - 작성한 회원과 다른회원
      const anotherMemberId = 2;
      const anotherMember: Member = Member.createMember('2@naver.com', 21, MemberSex.FEMALE, '1234')
      anotherMember.id = anotherMemberId;

      //then
      await expect(service.deleteBoard(boardId, anotherMember)).rejects.toThrow(
        new UnauthorizedException(UNAUTHORIZE_ACCESS_DELETE_MSG)
      ) 
    })
  })
});
