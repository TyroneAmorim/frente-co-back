import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from 'src/controllers/client.controller';
import { Address } from 'src/entities/address.entity';
import { Client } from 'src/entities/client.entity';
import { ClientService } from 'src/services/client.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Address])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
