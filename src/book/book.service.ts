import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/db/prisma.service';
import { PageService } from 'src/paging/page.service';
import { BookDTO } from './book.dto';

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pageService: PageService,
  ) {
  }

  getBooksListParams(books: Book[], page = 1) {
    const count = books.length;
    const allPages = Math.ceil(count / Number(process.env.PAGE_SIZE));
    const pageCorrected = this.pageService.getPage(page ?? 1, allPages);
    const { start, last } = this.pageService.fromFirstToLastPages(pageCorrected, allPages);

    return {
      page: pageCorrected, startPage: start, lastPage: last, allPages: allPages,
    };
  }

  async getBooksByPage(pageIn = 1) {
    try {
      const allBooks = await this.prisma.book.findMany();
      const { page, startPage, lastPage, allPages } = this.getBooksListParams(
        allBooks, pageIn,
      );
      const pageSize = Number(process.env.PAGE_SIZE);
      const books = await this.prisma.book.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
      });
      return {
        books: plainToInstance(BookDTO, books, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }), page: page, startPage: startPage, lastPage: lastPage, allPages: allPages,
      };
    } catch (e) {
      console.log(e);
    }
  }

  async getBookById(id: number) {
    return await this.prisma.book.findFirst({
      where: {
        id: Number(id),
      },
    });
  }

  async getBooksByUserId(userId: number) {
    const booksByUser = await this.prisma.journal_Notes.findMany({
      where: {
        user_id: Number(userId),
      },
      include: {
        book: true,
      },
    });
    const booksByUserArr = [];
    booksByUser.forEach((item) => {
      booksByUserArr.push(item.book);
    });
    return booksByUserArr;
  }

  async getBookGenres(bookId: number) {
    const bookGenres = await this.prisma.books_Genres.findMany({
      where: {
        book_id: Number(bookId),
      },
      include: {
        genre: true,
      },
    });
    const bookGenresArr = [];
    bookGenres.forEach((item) => {
      bookGenresArr.push(item.genre);
    });
    return bookGenresArr;
  }

  async getGenreBooks(genreId: number) {
    const bookGenres = await this.prisma.books_Genres.findMany({
      where: {
        genre_id: Number(genreId),
      },
      include: {
        book: true,
      },
    });
    const bookGenresArr = [];
    bookGenres.forEach((item) => {
      bookGenresArr.push(item.book);
    });
    return { count: bookGenresArr.length, books: bookGenresArr };
  }
}