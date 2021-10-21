import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../member/member.entity';
import { MemberSex } from '../member/member.sex-enum';
import { BOARD_DELETE_SUCCESS_MSG, NOT_FOUND_BOARD_MSG, UNAUTHORIZE_ACCESS_RESOURCE_MSG } from '../message/message';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { BoardRequestDto } from './dto/board_request.dto';
import { BoardResponseDto } from './dto/board_response.dto';

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
  create({title, content, createdTime ,member} : {title: string, content: string, createdTime: number ,member: Member}) : Board{
    const newBoard: Board = Board.createBoard(title, content, member);

    return newBoard;
  }

  //repository save()메서드
  async save(board: Board){
    if(board.id){
      //update라면
      this.boards = this.boards.map(each => {
        if(each.id == board.id){
          each.title = board.title;
          each.content = board.content;

          return each;
        }
        return each;
      })
    }else{
      //create라면
      board.id = this.id++;
      this.boards.push(board);
    }
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
      
      const boardDto1 : BoardRequestDto = new BoardRequestDto('1 게시물입니당!', '갑자기 날씨가 넘 추워111');
      const boardDto2 : BoardRequestDto = new BoardRequestDto('2 게시물입니당!', '갑자기 날씨가 넘 추워222');
      const boardDto3 : BoardRequestDto = new BoardRequestDto('3 게시물입니당!', '갑자기 날씨가 넘 추워333');
      const boardDto4 : BoardRequestDto = new BoardRequestDto('4 게시물입니당!', '갑자기 날씨가 넘 추워444');
      const boardDto5 : BoardRequestDto = new BoardRequestDto('5 게시물입니당!', '갑자기 날씨가 넘 추워555');
      
      await service.createBoard(boardDto1, member);
      await service.createBoard(boardDto2, member);
      await service.createBoard(boardDto3, member);
      await service.createBoard(boardDto4, member);
      await service.createBoard(boardDto5, member);

      const id: number = 1;

      //when
      const resultBoard = await service.getBoardById(id);

      //then
      expect(resultBoard).toBeInstanceOf(BoardResponseDto);
      expect(resultBoard._title).toEqual('1 게시물입니당!')
      expect(resultBoard._content).toEqual('갑자기 날씨가 넘 추워111')
    })
    it('id로 게시판 조회 - 게시판 없음', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      
      const boardDto1 : BoardRequestDto = new BoardRequestDto('1 게시물입니당!', '갑자기 날씨가 넘 추워111');
      const boardDto2 : BoardRequestDto = new BoardRequestDto('2 게시물입니당!', '갑자기 날씨가 넘 추워222');
      const boardDto3 : BoardRequestDto = new BoardRequestDto('3 게시물입니당!', '갑자기 날씨가 넘 추워333');
      const boardDto4 : BoardRequestDto = new BoardRequestDto('4 게시물입니당!', '갑자기 날씨가 넘 추워444');
      const boardDto5 : BoardRequestDto = new BoardRequestDto('5 게시물입니당!', '갑자기 날씨가 넘 추워555');

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
      
      const boardDto1 : BoardRequestDto = new BoardRequestDto('1 게시물입니당!', '갑자기 날씨가 넘 추워111');
      const boardDto2 : BoardRequestDto = new BoardRequestDto('2 게시물입니당!', '갑자기 날씨가 넘 추워222');
      const boardDto3 : BoardRequestDto = new BoardRequestDto('3 게시물입니당!', '갑자기 날씨가 넘 추워333');
      const boardDto4 : BoardRequestDto = new BoardRequestDto('4 게시물입니당!', '갑자기 날씨가 넘 추워444');
      const boardDto5 : BoardRequestDto = new BoardRequestDto('5 게시물입니당!', '갑자기 날씨가 넘 추워555');

      service.createBoard(boardDto1, member);
      service.createBoard(boardDto2, member);
      service.createBoard(boardDto3, member);
      service.createBoard(boardDto4, member);
      service.createBoard(boardDto5, member);

      //when
      const result = await service.getAllBoards(30, 1); // 1페이지의 30개 = 0 ~ 29 index

      //then
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(5);
    })
  })

  //== creatBoard test == //
  describe('createBoard test', () => {
    it('게시물 생성 성공', async () => {
      //given
      const boardDto : BoardRequestDto = new BoardRequestDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      //when
      const resultBoard :BoardResponseDto = await service.createBoard(boardDto, member);

      //then
      expect(resultBoard._title).toEqual('첫 게시물입니당!');
      expect(resultBoard._content).toEqual('갑자기 날씨가 넘 추워')
      expect(resultBoard._member).toEqual(member);
    })
    it('한 회원이 게시물 세개 생성', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      const boardDto1 : BoardRequestDto = new BoardRequestDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const boardDto2 : BoardRequestDto = new BoardRequestDto('두번째 게시물입니당!', '감기걸림 ㅠ;;');
      const boardDto3 : BoardRequestDto = new BoardRequestDto('마지막 게시물입니당!', '그래서 전기장판삼 ㅇㅇ;;');

      //when
      service.createBoard(boardDto1, member);
      service.createBoard(boardDto2, member);
      service.createBoard(boardDto3, member);
      const result = await service.getAllBoards(30, 1);

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
      
      const boardDto1 : BoardRequestDto = new BoardRequestDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const boardDto2 : BoardRequestDto = new BoardRequestDto('두번째 게시물입니당!', '감기걸림 ㅠ;;');
      const boardDto3 : BoardRequestDto = new BoardRequestDto('마지막 게시물입니당!', '그래서 전기장판삼 ㅇㅇ;;');

      await service.createBoard(boardDto1, member);
      await service.createBoard(boardDto2, member);
      await service.createBoard(boardDto3, member);

      const boardId:number = 2; //두번째 게시글 삭제해보자

      //when
      const msg = await service.deleteBoard(boardId, member);
      const result = await service.getAllBoards(30, 1);

      //then
      expect(msg).toEqual(BOARD_DELETE_SUCCESS_MSG);
      expect(result.length).toEqual(2);
    })

    it('게시글 삭제 - 없는 게시글 예외발생', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      
      const boardDto1 : BoardRequestDto = new BoardRequestDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const boardDto2 : BoardRequestDto = new BoardRequestDto('두번째 게시물입니당!', '감기걸림 ㅠ;;');
      const boardDto3 : BoardRequestDto = new BoardRequestDto('마지막 게시물입니당!', '그래서 전기장판삼 ㅇㅇ;;');

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
      
      const boardDto1 : BoardRequestDto = new BoardRequestDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const boardDto2 : BoardRequestDto = new BoardRequestDto('두번째 게시물입니당!', '감기걸림 ㅠ;;');
      const boardDto3 : BoardRequestDto = new BoardRequestDto('마지막 게시물입니당!', '그래서 전기장판삼 ㅇㅇ;;');

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
        new UnauthorizedException(UNAUTHORIZE_ACCESS_RESOURCE_MSG)
      ) 
    })
  })

  // == update test == //
  describe('updateBoard test', () => {
    it('게시글 업데이트 - 성공', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      
      const boardDto1 : BoardRequestDto = new BoardRequestDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const boardDto2 : BoardRequestDto = new BoardRequestDto('두번째 게시물입니당!', '감기걸림 ㅠ;;');
      const boardDto3 : BoardRequestDto = new BoardRequestDto('마지막 게시물입니당!', '그래서 전기장판삼 ㅇㅇ;;');

      await service.createBoard(boardDto1, member);
      await service.createBoard(boardDto2, member);
      await service.createBoard(boardDto3, member);

      const boardId:number = 2; // 2 id의 게시글 업데이트해보쟈

      const updateBoardDto : BoardRequestDto = new BoardRequestDto('두번째 수정된 두번째 게시물임다!', '감기 다나았어요 ㅎㅎ');
      
      //when
      const updateBoard = await service.updateBoard(boardId, member, updateBoardDto)
    
      //then
      expect(updateBoard._title).toEqual('두번째 수정된 두번째 게시물임다!')
      expect(updateBoard._content).toEqual('감기 다나았어요 ㅎㅎ');
      expect(updateBoard._id).toEqual(2)
    })

    it('게시글 업데이트 - 업데이트할 게시글 없음', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      
      const boardDto1 : BoardRequestDto = new BoardRequestDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const boardDto2 : BoardRequestDto = new BoardRequestDto('두번째 게시물입니당!', '감기걸림 ㅠ;;');
      const boardDto3 : BoardRequestDto = new BoardRequestDto('마지막 게시물입니당!', '그래서 전기장판삼 ㅇㅇ;;');

      await service.createBoard(boardDto1, member);
      await service.createBoard(boardDto2, member);
      await service.createBoard(boardDto3, member);

      //when
      const boardId:number = 100; // 100 id의 게시글 (없는 게시글) 업데이트해보쟈
      
      const updateBoardDto : BoardRequestDto = new BoardRequestDto('100번째 수정된 두번째 게시물임다!', '수정수정!@!@');
      
      //then
      await expect(service.updateBoard(boardId, member, updateBoardDto)).rejects.toThrow(
        new NotFoundException(NOT_FOUND_BOARD_MSG)
      ) 
    })
    it('게시글 업데이트 - 권한 없음', async () => {
      //given
      const memberId = 1;
      const member: Member = Member.createMember('1@naver.com', 20, MemberSex.MALE, '1234');
      member.id = memberId;
      
      const boardDto1 : BoardRequestDto = new BoardRequestDto('첫 게시물입니당!', '갑자기 날씨가 넘 추워');
      const boardDto2 : BoardRequestDto = new BoardRequestDto('두번째 게시물입니당!', '감기걸림 ㅠ;;');
      const boardDto3 : BoardRequestDto = new BoardRequestDto('마지막 게시물입니당!', '그래서 전기장판삼 ㅇㅇ;;');

      await service.createBoard(boardDto1, member);
      await service.createBoard(boardDto2, member);
      await service.createBoard(boardDto3, member);

      const boardId:number = 2; // 2 id의 게시글 업데이트해보쟈
      
      const updateBoardDto : BoardRequestDto = new BoardRequestDto('100번째 수정된 두번째 게시물임다!', '수정수정!@!@');
      
      //when - 작성한 회원과 다른회원
      const anotherMemberId = 2;
      const anotherMember: Member = Member.createMember('2@naver.com', 21, MemberSex.FEMALE, '1234')
      anotherMember.id = anotherMemberId;

      //then
      await expect(service.updateBoard(boardId, anotherMember, updateBoardDto)).rejects.toThrow(
        new UnauthorizedException(UNAUTHORIZE_ACCESS_RESOURCE_MSG)
      ) 
    })
  })
});
