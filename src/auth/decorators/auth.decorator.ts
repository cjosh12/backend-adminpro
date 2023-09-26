import { UseGuards, applyDecorators } from "@nestjs/common";
import { ValidRoles } from "../enum";
import { RoleProtected } from "./role-protected.decorator";
import { UserRoleGuard } from "../guards";
import { AuthGuard } from "@nestjs/passport";

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard),
    );
}