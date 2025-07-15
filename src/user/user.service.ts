import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { UserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import { UserRoles } from '../constants/constants';
import { JwtService } from '@nestjs/jwt';
import { PageService } from '../paging/page.service';
import { BookService } from '../book/book.service';
import { CriteriaDTO } from '../search/criteria.dto';
import { plainToInstance } from 'class-transformer';
import { BookDTO } from '../book/book.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly pageService: PageService,
    private readonly bookService: BookService,
  ) {
  }

  async getUser(user: UserDTO) {
    const foundUser: User = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: user.email,
          },
          {
            username: user.username,
          },
        ],

      },
    });
    return foundUser;
  }

  async createUser(user: UserDTO) {
    const hash = await bcrypt.hash(user.password, 10);
    await this.prisma.user.create({
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        surname: user.surname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        password: hash,
        role: UserRoles.READER,
      },
    });
  }

  async getFavouriteBooks(userId, params: CriteriaDTO) {
    const favorites = await this.prisma.favourite.findMany({
      where: {
        user_id: Number(userId),
      },
      include: {
        book: true,
      },
    });
    const { page, startPage, lastPage, allPages } = this.bookService.getBooksListParams(
      favorites.map((val) => val.book), params.page,
    );
    const pageSize = Number(process.env.PAGE_SIZE);
    const books = await this.prisma.favourite.findMany({
      where: {
        user_id: Number(userId),
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        book: true,
      },
    });
    return {
      books: plainToInstance(BookDTO, books.map((val) => val.book), {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }), page: page, startPage: startPage, lastPage: lastPage, allPages: allPages,
    };
  }

  async addOrDeleteFavourite(token: string, bookId: number) {
    const user: UserDTO = this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });

    const favourite = await this.prisma.favourite.findUnique({
      where: {
        book_id_user_id: {
          user_id: user.id,
          book_id: Number(bookId),
        },
      },
    });

    if (!favourite) {
      await this.prisma.favourite.create({
        data: {
          user_id: user.id,
          book_id: Number(bookId),
        },
      });
    } else {
      await this.prisma.favourite.delete({
        where: {
          book_id_user_id: {
            user_id: user.id,
            book_id: Number(bookId),
          },
        },
      });
    }
  }

  async getUserProfile(userId: number) {
    try {
      const { firstname, lastname, surname, email, phone, username } = await this.prisma.user.findFirst({
        where: {
          id: Number(userId),
        },
      });
      return [
        { field: 'Имя', value: firstname },
        { field: 'Фамилия', value: lastname },
        { field: 'Отчество', value: surname },
        { field: 'Имя пользователя', value: username },
        { field: 'Почта', value: email },
        { field: 'Телефон', value: phone },
      ];
    } catch (e) {
      console.log(e);
    }
  }
}
