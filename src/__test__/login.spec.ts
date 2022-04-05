import { LoginController } from '../controllers/login.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from '../services/login.service';
import { LoginResponse } from 'src/interfaces/login.interface';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/dto/login.dto';

const loginInfo: LoginDTO = {
  email: 'email@email.com',
  password: '123456',
};
const loginResponse: LoginResponse = {
  auth: true,
  token: '123456',
};
describe('Test login features', () => {
  let loginController: LoginController;
  let loginService: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: {
            login: jest.fn().mockResolvedValue(loginResponse),
          },
        },
      ],
    }).compile();

    loginController = module.get<LoginController>(LoginController);
    loginService = module.get<LoginService>(LoginService);
  });
  it('is defined', () => {
    expect(loginController).toBeDefined();
    expect(loginService).toBeDefined();
  });

  it('login successfully', async () => {
    const response = await loginController.login(loginInfo);
    expect(response).toEqual(loginResponse);
    expect(loginService.login).toHaveBeenCalledWith(loginInfo);
  });

  it('login with wrong credentials  return error', () => {
    jest
      .spyOn(loginService, 'login')
      .mockRejectedValueOnce(new UnauthorizedException());

    expect(loginService.login(loginInfo)).rejects.toThrowError();
  });
});
