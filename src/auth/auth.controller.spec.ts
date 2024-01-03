import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiException } from 'src/exceptions/api-exception';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return the result of authService.login', async () => {
      const loginDto: LoginDto = {
        username: 'john',
        password: 'changeme',
      };
      const expectedResult: LoginResponseDto = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJzdWIiOjEyMywiaWF0IjoxNzAyNTAyNDE3LCJleHAiOjE3MDI1MDI0Nzd9.lcNX_Rcm3oRSN0tV7ewIzAZh73caD0qyxCYqe-q6Wfw',
      };
      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      expect(await controller.login(loginDto)).toBe(expectedResult);
    });

    it('should throw an ApiException when authService.login throws an error', async () => {
      const loginDto: LoginDto = {
        username: '123',
        password: 'changeme',
      };
      const error = new Error('Error');
      jest.spyOn(authService, 'login').mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(ApiException);
    });
  });
});
