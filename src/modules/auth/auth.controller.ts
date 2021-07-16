import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from '../../guards/local/local-auth-guard.guard';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../guards/jwt/jwt-auth-guard.guard';
import { RefreshDTO } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() body: LoginDTO, @Request() req) {
        console.log(req.user);
        return this.authService.login(req.user);
    }

    @Post('refresh')
    async refresh(@Body() body: RefreshDTO, @Request() req) {
        return this.authService.refresh(body);
    }
}
