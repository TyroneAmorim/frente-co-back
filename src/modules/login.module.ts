import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginController } from '../controllers/login.controller';
import { Client } from '../entities/client.entity';
import { LoginService } from '../services/login.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
