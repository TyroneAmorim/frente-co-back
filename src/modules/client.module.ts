import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from '../controllers/client.controller';
import { Address } from '../entities/address.entity';
import { Client } from '../entities/client.entity';
import { ClientService } from '../services/client.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Address])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
