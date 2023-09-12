import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users';
import * as bcrypt from 'bcryptjs';

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
      delete user.password;

      return user;
    }catch (error) {
      console.log(error);
      this.handleDBErrors(error);
    }
  }
  private handleDBErrors(error:any):never{
    if(error.code === '23502'){
      throw new BadRequestException(error.detail);
    }
    throw new BadRequestException('revisar logs del servidor')
  }
  }
