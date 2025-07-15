import { Module } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { SearchService } from './search.service';

@Module({
    imports: [PrismaService],
    providers: [SearchService],
    exports: [SearchService],
})
export class BookModule {}
