import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { User } from '../types';

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
  }

  async register(user: UserDTO) {
    const foundUser: User = await this.userService.getUser(user);
    if (foundUser) throw new BadRequestException('Пользователь уже существует!');

    await this.userService.createUser(user);
  }
}