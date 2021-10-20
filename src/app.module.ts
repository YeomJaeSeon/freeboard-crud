import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { BoardModule } from './board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), MemberModule, BoardModule],
})
export class AppModule {}
