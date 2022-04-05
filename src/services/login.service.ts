import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDTO } from '../dto/login.dto';
import { Client } from '../entities/client.entity';
import { LoginResponse } from '../interfaces/login.interface';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';

export class LoginService {
  constructor(
    @InjectRepository(Client) private clientRepo: Repository<Client>,
  ) {}

  async login(loginData: LoginDTO): Promise<LoginResponse> {
    const userExists = await this.clientRepo.findBy({
      email: loginData.email,
      password: loginData.password,
    });

    if (!userExists.length) {
      throw new UnauthorizedException();
    }
    const token = sign(
      {
        id: userExists[0].id,
      },
      process.env.JWT_SECRET,
    );

    const authData: LoginResponse = {
      auth: true,
      token,
    };

    return authData;
  }
}
