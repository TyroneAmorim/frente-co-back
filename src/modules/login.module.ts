import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginController } from 'src/controllers/login.controller';
import { Client } from 'src/entities/client.entity';
import { LoginService } from 'src/services/login.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
