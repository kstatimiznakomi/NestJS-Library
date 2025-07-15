import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return "Here's my first NestJS project - libre!";
  }
}
