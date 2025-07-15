import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserDTO } from '../user/user.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
  }

  async auth(user: UserDTO, response) {
    const foundUser: User = await this.userService.getUser(user);
    if (!foundUser) throw new NotFoundException('Пользователь не найден!');
    if (!compareSync(user.password, foundUser.password)) throw new HttpException('Неверный пароль!', 401);

    return this.createTokens(foundUser, response);
  }


  createTokens(user, response) {
    response.cookie('accessToken', this.getAccessToken(user.id, user.username), {
      expiresIn: '1h',
      maxAge: 60 * 60 * 1000, // 1 час
    });
    response.cookie('refreshToken', this.getRefreshToken(user.id, user.username), {
      expiresIn: '7d',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
    return {
      accessToken: this.getAccessToken(user.id, user.username),
      refreshToken: this.getRefreshToken(user.id, user.username),
    };
  }

  logout(res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  checkAuth(req: Request) {
    const cookies = { ...req.cookies };
    if (!cookies.refreshToken) return { isSigned: false };
    return { isSigned: true };
  }

  async refresh(req, response) {
    const cookies = { ...req.cookies };

    const user: UserDTO = this.jwtService.verify(cookies.refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return this.createTokens(user, response);
  }

  getAccessToken(id: number, username: string) {
    const payload = { id: id, username: username };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      algorithm: 'HS256',
      expiresIn: '1 day',
    });
  }

  getRefreshToken(id: number, username: string) {
    const payload = { id: id, username: username };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      algorithm: 'HS256',
      expiresIn: '1 week',
    });
  }
}
