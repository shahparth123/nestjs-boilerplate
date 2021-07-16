import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    logger: any;

    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
        console.log("local init");
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        console.log("user", user)
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}