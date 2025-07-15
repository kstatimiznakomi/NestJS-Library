import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { UserDTO } from '../user/user.dto';

@Controller(process.env.API)
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {
  }

  @Post('/register')
  async findPage(@Body() user: UserDTO) {
    return this.registerService.register(user);
  }
}