import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetClientDTO } from 'src/dto/getClient.dto';
import { NewClientDTO } from 'src/dto/newClient.dto';
import { Address } from 'src/entities/address.entity';
import { Client } from 'src/entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private repoClient: Repository<Client>,
    @InjectRepository(Address) private repoAddress: Repository<Address>,
  ) {}

  async get(queryOptions?: GetClientDTO): Promise<Client[]> {
    const customOptions = {
      relations: {
        address: true,
      },
    };

    const clients = !queryOptions.id
      ? await this.repoClient.find(customOptions)
      : await this.repoClient.findOne({
          where: { id: queryOptions.id },
          ...customOptions,
        });

    const clientsResult = clients as Client[];

    if (clientsResult === null || clientsResult.length === 0) {
      throw new NotFoundException();
    }
    return clientsResult;
  }

  async new(client: NewClientDTO): Promise<Client> {
    const checkIfExists = await this.repoClient.findBy({
      cpf: client.cpf,
    });

    if (checkIfExists.length) {
      throw new ConflictException();
    }

    const addressData: Address = {
      address: client.addressText,
      city: client.city,
      state: client.state,
    };

    const addressSaved = await this.repoAddress.save(addressData);

    const clientData: Client = {
      name: client.name,
      birthDate: client.birthDate,
      cpf: client.cpf,
      addressId: addressSaved.id,
      email: client.email,
      password: client.password,
    };

    return this.repoClient.save(clientData);
  }
}
