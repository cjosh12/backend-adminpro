import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users';
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from './services';
import { AuthController } from './controllers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies';


@Module({
  imports: [UsersModule,
    ConfigModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return{
          secret: configService.get('JWT_SECRET'),
          signOptions:{
            expiresIn: '30m',
          },
        };
      },
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
