import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MainMiddleware implements NestMiddleware {
  use(@Req() req: Request, res: Response, next: NextFunction) {
    next();
  }
}