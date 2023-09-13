import { 
  BadRequestException,
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { LoginDto, RegisterDto } from '../dto';
import { User } from 'src/users';
import { MyResponse } from 'src/core';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
        password: true,
        first_name: true,
        last_name: true,
        is_active: true,
        email: true,
      },
    });
    
    if(!user) throw new UnauthorizedException('Las credenciales no son validas');
    
    if(!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException(
      'Las credenciales no son validas');
    
    if(!user.is_active)
      throw new UnauthorizedException(
    'Usuario no activo, contacte al administrador',
    );

    delete user.password, delete user.is_active;

    const response: MyResponse<User> = {
      statusCode: 201,
      status: 'Created',
      message: 'Usuario encontrado con éxito',
      reply: user,
    };

    return response;
  }

  private handleDBErrors(error:any):never{
    if(error.code === '23502'){
      throw new BadRequestException(error.detail);
    }
    throw new BadRequestException('revisar logs del servidor')
  }
  }
