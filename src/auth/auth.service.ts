import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiException } from 'src/exceptions/api-exception';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    if (loginDto.username !== 'john' || loginDto.password !== 'changeme') {
      throw new ApiException(
        '[AuthService.login]' + 'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { username: loginDto.username, sub: 123 };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
