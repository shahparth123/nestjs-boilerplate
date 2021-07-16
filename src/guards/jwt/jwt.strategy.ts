import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.has("secret.jwtSecret") ? config.get("secret.jwtSecret") : process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        console.log(payload)
        return { ...payload };
    }
}