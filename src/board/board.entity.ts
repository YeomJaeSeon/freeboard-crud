import { Member } from "../member/member.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Board extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    //연관관계 매핑 (Board : Member = 다대 일)
    @ManyToOne(type => Member, (member) => member.boards, {eager: true})
    member: Member;

    //==Board 생성 메서드 ==//
    public static createBoard(title: string, content: string, member: Member): Board{
        const board : Board = new Board();

        board.title = title;
        board.content = content;
        board.member = member;

        return board;
    }
}