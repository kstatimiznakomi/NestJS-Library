import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogController } from './book/book.controller';
import { BookService } from './book/book.service';
import { PrismaModule } from './db/prisma.module';
import { PageService } from './paging/page.service';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MainMiddleware } from './middleware';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { RegisterService } from './register/register.service';
import { RegisterController } from './register/register.controller';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController, CatalogController, SearchController, AuthController, UserController, RegisterController],
  providers: [AppService, BookService, PageService, SearchService, AuthService, JwtService, UserService, RegisterService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MainMiddleware)
      .forRoutes(process.env.API);
  }
}
