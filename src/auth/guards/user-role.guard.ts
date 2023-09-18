import { BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators';
import { User } from 'src/users';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    )

    if (!validRoles || (validRoles && validRoles.length === 0)) return true; 
        
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('el usuario no se encontro');

    for (const role of user.roles){
      if(validRoles.includes(role)){
        return true;
      }
    }
    throw new ForbiddenException(
      `el usuario ${user.email} necesita tener este rol valido: [${validRoles}]`,
    );
  }
}
