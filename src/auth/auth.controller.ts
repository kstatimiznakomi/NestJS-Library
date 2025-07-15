import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller(process.env.API)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
  }

  @Post('/auth')
  async auth(@Body() user, @Res({ passthrough: true }) response: Response) {
    return await this.authService.auth(user, response);
  }

  @Get('/checkAuth')
  checkAuth(@Req() req: Request) {
    return this.authService.checkAuth(req);
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Get('/refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    return await this.authService.refresh(req, response);
  }
}