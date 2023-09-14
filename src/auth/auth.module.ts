import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users';
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from './services';
import { AuthController } from './controllers';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return{
          secret: configService.get('JWT_SECRET'),
          signOptions:{
            expiresIn: '1m',
          },
        };
      },
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
