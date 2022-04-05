import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NewClientDTO } from 'src/dto/newClient.dto';
import { ClientController } from '../controllers/client.controller';
import { Client } from '../entities/client.entity';
import { ClientService } from '../services/client.service';

const clientsResponse: Client = {
  name: '',
  password: '123456',
  birthDate: new Date(),
  email: '',
  cpf: '',
  addressId: 1,
  address: {
    id: 1,
    address: '',
    city: '',
    state: '',
  },
};

const clientData: NewClientDTO = {
  id: 0,
  name: '',
  email: 'email@email.com',
  password: '',
  birthDate: new Date(),
  cpf: '123456789',
  addressText: '',
  city: '',
  state: '',
  addressId: 0,
};

describe('Test client features', () => {
  let clientConstroller: ClientController;
  let clientService: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: ClientService,
          useValue: {
            get: jest.fn().mockResolvedValue(clientsResponse),
            new: jest.fn().mockResolvedValue(clientsResponse),
          },
        },
      ],
    }).compile();

    clientConstroller = module.get<ClientController>(ClientController);
    clientService = module.get<ClientService>(ClientService);
  });

  it('is defined', () => {
    expect(clientConstroller).toBeDefined();
    expect(clientService).toBeDefined();
  });

  it('get list clients', async () => {
    const resul = await clientConstroller.get();
    expect(resul).toEqual(clientsResponse);
  });

  it('not found users', () => {
    jest
      .spyOn(clientService, 'get')
      .mockRejectedValueOnce(new NotFoundException());

    expect(clientService.get).rejects.toThrowError();
  });

  it('create new client account', async () => {
    const result = await clientConstroller.new(clientData);
    expect(result).toEqual(clientsResponse);
    expect(clientService.new).toHaveBeenCalledWith(clientData);
  });
});
