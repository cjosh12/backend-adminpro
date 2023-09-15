import { Controller, Post, Body, Patch } from '@nestjs/common';

import { AuthService } from '../services';
import { ChangePasswordDto, LoginDto, RegisterDto } from '../dto';
import { User } from 'src/users';
import { MyResponse } from 'src/core';
import { LoginResponse } from '../interfaces';
import { Auth } from '../decorators';
import { GetUser } from 'src/users/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<MyResponse<User>>{
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<MyResponse<LoginResponse>>{
    return this.authService.login(loginDto);
  }

  @Patch('change-password')
  @Auth()
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
    ){
    return this.authService.changePassword(changePasswordDto, user);
  }
}
