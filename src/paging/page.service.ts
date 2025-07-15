import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class PageService {
  constructor(
    private readonly prisma: PrismaService,
  ) {
  }

  getPage(page: number, maxPages: number) {
    if (!Number(page)) page = 1;
    if (page >= maxPages) return maxPages;
    return Math.max(1, page);
  }

  fromFirstToLastPages(currentPage: number, lastPage: number) {
    let start = 1;
    let last = lastPage;
    const maxDrawingHalf = Number(process.env.MAX_DRAWING_PAGES) / 2;
    if (currentPage - Math.ceil(maxDrawingHalf) > 1) start = currentPage - maxDrawingHalf;
    if (currentPage + Math.ceil(maxDrawingHalf) <= lastPage) last = currentPage + maxDrawingHalf;
    return { start, last };
  }

  async getAllPages(page) {
    const count = (await this.prisma.book.findMany()).length;
    const allPages = Math.ceil(count / Number(process.env.PAGE_SIZE));
    page = this.getPage(page ?? 1, allPages);

    const { start, last } = this.fromFirstToLastPages(page, allPages);

  }
}