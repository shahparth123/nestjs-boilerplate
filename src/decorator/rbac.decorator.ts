import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../guards/jwt/jwt-auth-guard.guard';
import { RolesGuard } from '../guards/roles/roles-guard.guard';

export function RBAC(...roles) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(JwtAuthGuard, RolesGuard),
        ApiBearerAuth(),
        //ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}