import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  register(registerDto: RegisterDto) {
    const {password, ...userData } = registerDto;
    return password;
  }
}
