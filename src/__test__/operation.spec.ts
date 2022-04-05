import { Test, TestingModule } from '@nestjs/testing';
import { OperationController } from '../controllers/operation.controller';
import { NewOperationDTO } from '../dto/newOperation.dto';
import { Operation } from '../entities/operation.entity';
import { CurrentUserData } from '../interfaces/currentUser.interface';
import { OperationService } from '../services/operation.service';

const operationResponse: Operation = {
  clientId: 0,
  value: 10,
  paperMoneyType: 10,
  mainOperation: null,
  packageId: null,
  reserved: false,
  closed: false,
  openedAt: '',
  closedAt: '',
};

const usarData: CurrentUserData = {
  id: 0,
};

const newOperationData: NewOperationDTO = {
  value: 100,
  paperMoneyType: 10,
};

describe('Test client features', () => {
  let operationController: OperationController;
  let operationService: OperationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationController],
      providers: [
        {
          provide: OperationService,
          useValue: {
            getAll: jest.fn().mockResolvedValue(operationResponse),
            new: jest.fn().mockResolvedValue(operationResponse),
          },
        },
      ],
    }).compile();

    operationController = module.get<OperationController>(OperationController);
    operationService = module.get<OperationService>(OperationService);
  });

  it('is defined', () => {
    expect(operationController).toBeDefined();
    expect(operationService).toBeDefined();
  });

  it('get list operations', async () => {
    const resul = await operationController.getAll(usarData);
    expect(resul).toEqual(operationResponse);
    expect(operationService.getAll).toHaveBeenCalledWith(usarData);
  });

  it('create new operation', async () => {
    const resul = await operationController.new(newOperationData, usarData);
    expect(resul).toEqual(operationResponse);
    expect(operationService.new).toHaveBeenCalledWith(
      newOperationData,
      usarData,
    );
  });
});
