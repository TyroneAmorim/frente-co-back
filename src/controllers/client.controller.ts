import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { GetClientDTO } from '../dto/getClient.dto';
import { NewClientDTO } from '../dto/newClient.dto';
import { Client } from '../entities/client.entity';
import { CurrentUserData } from '../interfaces/currentUser.interface';
import { ClientService } from '../services/client.service';
import { UpdateResult } from 'typeorm';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post()
  new(@Body() client: NewClientDTO): Promise<Client> {
    return this.clientService.new(client);
  }

  @Patch()
  update(
    @Body() client: NewClientDTO,
    @CurrentUser() userData: CurrentUserData,
  ): Promise<UpdateResult> {
    return this.clientService.update(client, userData);
  }

  @Delete()
  delete(@CurrentUser() userData: CurrentUserData): Promise<void> {
    return this.clientService.delete(userData);
  }

  @Get()
  get(
    @Query() queryOptions?: GetClientDTO,
    @CurrentUser() userData?: CurrentUserData,
  ): Promise<Client[]> {
    return this.clientService.get(queryOptions, userData);
  }
}
