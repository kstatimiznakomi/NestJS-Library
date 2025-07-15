import { Controller, Get, HttpException, Param, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { BookService } from '../book/book.service';
import { Request } from 'express';
import { CriteriaDTO } from '../search/criteria.dto';

@Controller(`${process.env.API}/user`)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly bookService: BookService,
  ) {
  }

  @Get('/favourite/:bookId')
  async addFavourite(@Req() req: Request, @Param('bookId') bookId) {
    const cookies = { ...req.cookies };

    return this.userService.addOrDeleteFavourite(cookies.accessToken, bookId);
  }

  @Get('/favourite/u/:userId')
  async getFavouriteByUser(@Param('userId') userId, @Query() params: CriteriaDTO) {
    return this.userService.getFavouriteBooks(userId, params);
  }

  @Get('/:userId')
  async getUser(@Param('userId') userId) {
    const user = this.userService.getUserProfile(userId);

    if (!user) return new HttpException('Такого пользователя не существует!', 404);
    return user;
  }

  @Get('/:userId/books')
  async getUserBooks(@Param('userId') userId) {
    const user = this.userService.getUserProfile(userId);
    if (!user) return new HttpException('Такого пользователя не существует!', 404);

    const books = await this.bookService.getBooksByUserId(userId);
    return books;
  }
}