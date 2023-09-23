import { 
  BadRequestException,
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { ChangePasswordDto, LoginDto, RegisterDto } from '../dto';
import { User } from 'src/users';
import { MyResponse } from 'src/core';
import { JwtPayload, LoginResponse } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ){}

  async register(registerDto: RegisterDto){
    const {password, ...userData} = registerDto;

    const userVerificacion = await this.userRepository.findOne({
      where: {email: userData.email},
    });

    if(userVerificacion)
      throw new BadRequestException('el usuarion con ese correo ya se encuentra en existencia');

    try{
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password,10),
      });
      await this.userRepository.save(user);
      delete user.password, delete user.is_active;

      const response: MyResponse<User> = {
        statusCode: 201,
        status: 'Created',
        message: `usuario con el email ${userData.email} ha sido creado con exito`,
        reply: user,
      };

      return response;
    }catch (error) {
      console.log(error);
      this.handleDBErrors(error);
    }
  }

  async login(loginDto: LoginDto){
    const {email, password} = loginDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: {
        user_id: true,
        password: true,
        first_name: true,
        last_name: true,
        is_active: true,
        email: true,
      },
    });
    
    if(!user || (user && !bcrypt.compareSync(password, user.password))) 
    throw new UnauthorizedException('Las credenciales no son validas');
    
    if(!user.is_active)
      throw new UnauthorizedException(
    'Usuario no activo, contacte al administrador',
    );

    delete user.password, delete user.is_active;

    const token = this.getJwtToken({
      sub: user.user_id,
      user: user.email,
    });

    const response: MyResponse<LoginResponse> = {
      statusCode: 201,
      status: 'Created',
      message: 'Usuario encontrado con éxito',
      reply: {
        user,
        token,
      },
    };

    return response;
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    decoratorUser: User,
    ){
      const { old_password, new_password } = changePasswordDto;
  
      const user = await this.userRepository.findOne({
        where: { user_id: decoratorUser.user_id },
        select: {
          password: true,
        },
      });
  
      if (!bcrypt.compareSync(old_password, user.password))
        throw new BadRequestException('Las credenciales no son validas');
  
      try {
        const encodedPassword = bcrypt.hashSync(new_password, 10);
  
        const patchUser = await this.userRepository.preload({
          user_id: decoratorUser.user_id,
          password: encodedPassword,
        });
  
        await this.userRepository.save(patchUser);
  
        const response: MyResponse<Record<string, never>> = {
          statusCode: 200,
          status: 'OK',
          message: 'La Contraseña se cambio con éxito',
          reply: {},
        };
  
        return response;
      } catch (error) {
        console.log(error);
        this.handleDBErrors(error);
      }
    }
  
    checkToken(user: User) {
      const token = this.getJwtToken({ sub: user.user_id, user: user.email });
  
      return {
        user,
        token,
      };
    }

  private getJwtToken(payload: JwtPayload): string{
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error:any):never{
    if(error.code === '23502'){
      throw new BadRequestException(error.detail);
    }
    throw new BadRequestException('revisar logs del servidor')
  }
  }
