import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiException } from 'src/exceptions/api-exception';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return an access token when the username and password are correct', async () => {
      const loginDto: LoginDto = { username: 'john', password: 'changeme' };
      const expectedResult: LoginResponseDto = { accessToken: 'token' };
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      expect(await service.login(loginDto)).toEqual(expectedResult);
    });

    it('should throw an ApiException when the username or password are incorrect', async () => {
      const loginDto: LoginDto = { username: 'john', password: 'wrong' };

      await expect(service.login(loginDto)).rejects.toThrow(ApiException);
    });
  });
});