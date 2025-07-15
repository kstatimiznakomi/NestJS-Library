import { Controller, Get, Query } from '@nestjs/common';
import { CriteriaDTO } from './criteria.dto';
import { SearchService } from './search.service';

@Controller(process.env.API)
export class SearchController {
  constructor(private readonly searchService: SearchService) {
  }

  @Get('/search')
  async findPage(@Query() params: CriteriaDTO) {
    return this.searchService.search(params);
  }

  @Get('/criteria')
  async getCriteria() {
    return this.searchService.getCriteria();
  }


}