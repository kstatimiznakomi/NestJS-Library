import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CriteriaDTO } from './criteria.dto';
import { BookService } from '../book/book.service';
import { PageService } from '../paging/page.service';
import { plainToInstance } from 'class-transformer';
import { BookDTO } from '../book/book.dto';

@Injectable()
export class SearchService {
  /* eslint no-const: off */
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookService: BookService,
    private readonly pageService: PageService,
  ) {
  }

  async search(params: CriteriaDTO) {
    try {
      if (!Object.keys(params).length) {
        return this.bookService.getBooksByPage(1);
      }
      if (Object.keys(params).length < 2 && params.page) {
        return this.bookService.getBooksByPage(params.page);
      }
      const pageSize = Number(process.env.PAGE_SIZE);

      const searchQuery = {
        take: pageSize,
        skip: ((params.page ?? 1) - 1) * pageSize,
        where: {
          AND: [],
        },
        include: {} as any,
      };

      if (params.bookName) {
        searchQuery.where.AND.push({
          bookName: {
            contains: params.bookName,
            mode: 'insensitive',
          },
        });
      }

      if (params.publicDate) {
        searchQuery.where.AND.push({
          publicDate: Number(params.publicDate),
        });
      }

      if (params.authorId) {
        searchQuery.where.AND.push({
          author: {
            some: {
              authorId: Number(params.authorId),
            },
          },
        });
        searchQuery.include.author = {
          include: { author: true },
        };
      }

      if (params.genreId) {
        searchQuery.where.AND.push({
          genres: {
            some: {
              genre_id: Number(params.genreId),
            },
          },
        });
        searchQuery.include.genres = {
          include: {
            genre: true,
          },
        };
      }

      if (params.publisherId) {
        searchQuery.where.AND.push({
          publisher: {
            some: {
              publisher_id: Number(params.publisherId),
            },
          },
        });
        searchQuery.include.publisher = {
          include: { publisher: true },
        };
      }

      const count = (await this.prisma.book.findMany(searchQuery)).length;
      const allPages = Math.ceil(count / Number(process.env.PAGE_SIZE));
      params.page = this.pageService.getPage(params.page ?? 1, allPages);
      const { start, last } = this.pageService.fromFirstToLastPages(params.page, allPages);

      const books = await this.prisma.book.findMany(searchQuery);

      if (!books.length) return new HttpException('Не было найдено книг по запросу!', 404);
      return {
        books: plainToInstance(BookDTO, books, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }), page: params.page, startPage: start, lastPage: last,
      };
    } catch (e) {
      console.log(e);
    }
  }

  async getCriteria() {
    try {
      const authors = await this.prisma.author.findMany({
        take: 10,
      });
      const genres = await this.prisma.genre.findMany({
        take: 10,
      });
      const publishers = await this.prisma.publisher.findMany({
        take: 10,
      });

      return {
        authors: authors,
        genres: genres,
        publishers: publishers,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
