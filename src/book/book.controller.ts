import { Controller, Get, Param } from '@nestjs/common';
import { BookService } from './book.service';

@Controller(`${process.env.API}`)
export class CatalogController {
  constructor(private readonly bookService: BookService) {
  }

  @Get(['/catalog/:page', '/catalog'])
  async findPage(@Param('page') page) {
    return this.bookService.getBooksByPage(page ?? 1);
  }

  @Get('/book/:id')
  async getBook(@Param('id') id) {
    return this.bookService.getBookById(id);
  }

  @Get('/:bookId/genres')
  async bookGenres(@Param('bookId') bookId) {
    return this.bookService.getBookGenres(bookId);
  }

  @Get('/:genreId/books')
  async genreBooks(@Param('genreId') genreId) {
    return this.bookService.getGenreBooks(genreId);
  }
}
