import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetClientDTO } from '../dto/getClient.dto';
import { NewClientDTO } from '../dto/newClient.dto';
import { Address } from '../entities/address.entity';
import { Client } from '../entities/client.entity';
import { CurrentUserData } from '../interfaces/currentUser.interface';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private repoClient: Repository<Client>,
    @InjectRepository(Address) private repoAddress: Repository<Address>,
  ) {}

  async get(
    queryOptions?: GetClientDTO,
    userData?: CurrentUserData,
  ): Promise<Client[]> {
    const customOptions = {
      relations: {
        address: true,
      },
    };

    const clients =
      !queryOptions.id && !userData
        ? await this.repoClient.find(customOptions)
        : await this.repoClient.findOne({
            where: { id: queryOptions.id ?? userData.id },
            ...customOptions,
          });

    const clientsResult = clients as Client[];

    if (clientsResult === null || clientsResult.length === 0) {
      throw new NotFoundException();
    }
    return clientsResult;
  }

  deconstructClientData(client: NewClientDTO): any {
    const addressData: Address = {
      address: client.addressText,
      city: client.city,
      state: client.state,
    };

    const clientData: Client = {
      name: client.name,
      birthDate: client.birthDate,
      cpf: client.cpf,
      email: client.email,
      password: client.password,
    };

    return { addressData, clientData };
  }

  async new(client: NewClientDTO): Promise<Client> {
    const checkIfExists = await this.repoClient.findBy({
      cpf: client.cpf,
    });

    if (checkIfExists.length) {
      throw new ConflictException();
    }

    const dataDeconstructed = this.deconstructClientData(client);

    const addressSaved = await this.repoAddress.save(
      dataDeconstructed.addressData,
    );

    const clientData = dataDeconstructed.clientData;
    clientData.addressId = addressSaved.id;

    return this.repoClient.save(clientData);
  }

  async update(
    client: NewClientDTO,
    userData: CurrentUserData,
  ): Promise<UpdateResult> {
    const dataDeconstructed = this.deconstructClientData(client);

    const clientData = await this.repoClient.find({
      where: { id: userData.id },
    });

    this.repoAddress.save({
      id: clientData[0].addressId,
      ...dataDeconstructed.addressData,
    });

    return this.repoClient.save({
      id: userData.id,
      ...dataDeconstructed.clientData,
    });
  }

  async delete(userData: CurrentUserData): Promise<void> {
    if (!userData) throw new UnauthorizedException();

    const addressData = await this.repoClient.find({
      where: {
        id: userData.id,
      },
    });
    await this.repoClient.softDelete({
      id: userData.id,
    });
    this.repoAddress.delete({
      id: addressData[0].id,
    });
  }
}
