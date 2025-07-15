import { Module } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { RegisterService } from './register.service';

@Module({
  imports: [PrismaService],
  providers: [RegisterService],
  exports: [RegisterService],
})
export class RegisterModule {
}
