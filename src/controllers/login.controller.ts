import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from 'src/dto/login.dto';
import { LoginResponse } from 'src/interfaces/login.interface';
import { LoginService } from 'src/services/login.service';

@Controller('auth')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post('/login')
  login(@Body() loginData: LoginDTO): Promise<LoginResponse> {
    return this.loginService.login(loginData);
  }
}
