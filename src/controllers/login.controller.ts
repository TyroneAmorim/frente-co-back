import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from '../dto/login.dto';
import { LoginResponse } from '../interfaces/login.interface';
import { LoginService } from '../services/login.service';

@Controller('auth')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post('/login')
  login(@Body() loginData: LoginDTO): Promise<LoginResponse> {
    return this.loginService.login(loginData);
  }
}
