import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetClientDTO } from 'src/dto/getClient.dto';
import { NewClientDTO } from 'src/dto/newClient.dto';
import { Client } from 'src/entities/client.entity';
import { ClientService } from 'src/services/client.service';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post()
  new(@Body() client: NewClientDTO): Promise<Client> {
    return this.clientService.new(client);
  }

  @Get()
  get(@Query() queryOptions?: GetClientDTO): Promise<Client[]> {
    return this.clientService.get(queryOptions);
  }
}
