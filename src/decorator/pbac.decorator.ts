import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt/jwt-auth-guard.guard';
import { PermissionsGuard } from '../guards/permissions/permissions-guard.guard';

export function PBAC(...permissions) {
    return applyDecorators(
        SetMetadata('permissions', permissions),
        UseGuards(JwtAuthGuard, PermissionsGuard),
        ApiBearerAuth(),
        //ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}