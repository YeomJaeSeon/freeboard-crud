import { type } from "os";
import { Member } from "src/member/member.entity";
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
    @ManyToOne(type => Member, (member) => member.boards, {eager: false})
    member: Member;
}