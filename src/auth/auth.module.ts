import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../db/prisma.service';

@Module({
  imports: [PrismaService],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
}
