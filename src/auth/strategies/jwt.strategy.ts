import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";

import { Strategy, Extractjwt } from 'passport-jwt';
import { JwtPayload } from "../interfaces";

import { User } from "src/users";
import { Repository } from "typeorm";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private configSerivice: ConfigService,
    ){
        super({
            secretOrKey: configSerivice.get('JWT_SECRET'),
            jwtFromRequest: Extractjwt.fromAuthHeatherAsBearerToken(),
        });
    }
    async validate(payload: JwtPayload): Promise<User>{
        const { user } = payload;

        const DBuser = await this.userRepository.findOneBy({email: user});
        if(!DBuser) throw new UnauthorizedException('El token no es valido');

        if(!DBuser.is_active) throw new UnauthorizedException('El usuario no está activo, comunicarse con un administrador');

        return DBuser;
    }
}