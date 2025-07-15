import { Module } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { UserService } from './user.service';
import { BookService } from '../book/book.service';

@Module({
  imports: [PrismaService, BookService],
  providers: [],
  exports: [UserService],
})
export class UserModule {
}
