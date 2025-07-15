import { Module } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { UserService } from '../user/user.service';
import { BookService } from './book.service';

@Module({
  imports: [PrismaService],
  providers: [UserService],
  exports: [BookService],
})
export class BookModule {
}
