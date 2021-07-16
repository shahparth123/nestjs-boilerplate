import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import * as config from 'config';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }
    async validateUser(email: string, password: string): Promise<any> {
        console.log(email, password);
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException({ statusCode: 401, message: 'Username/Password not matched.' });
        }
        else if (user.status == 0) {
            throw new UnauthorizedException({ statusCode: 401, message: 'User is disabled.' });
        }
        else if (user.status == 1) {
            throw new UnauthorizedException({ statusCode: 401, message: 'User is not verified.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const permissions = await this.userService.generatePermissions(user)
            console.log(permissions)
            return { ...user, permissions: permissions, password: undefined };
        } else {
            throw new UnauthorizedException({ statusCode: 401, message: 'Username/Password not matched.' });
        }
    }

    async login(user: any) {
        const refreshTokenId = uuid();
        const payload = { ...user, sub: user.id, refreshTokenId: refreshTokenId, tokenId: uuid() };
        const refreshPayload = { ...user, sub: user.id, tokenId: refreshTokenId }
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: '1 Hour'
            }),
            refresh_token: this.jwtService.sign(refreshPayload, { secret: config.has("secret.refreshSecret") ? config.get("secret.refreshSecret") : process.env.REFRESH_SECRET, expiresIn: '30 Days' })
        };
    }

    async refresh(user: any) {
        const old_access_token = this.jwtService.verify(user.access_token, { ignoreExpiration: true });
        const refresh_token = this.jwtService.verify(user.refresh_token, { secret: config.has("secret.refreshSecret") ? config.get("secret.refreshSecret") : process.env.REFRESH_SECRET });
        if (old_access_token.refreshTokenId === refresh_token.tokenId && refresh_token.sub === old_access_token.sub) {
            const user = await this.userService.findById(old_access_token.sub);
            if (!user) {
                throw new UnauthorizedException({ statusCode: 401, message: 'Username/Password not matched.' });
            }
            else if (user.status == 0) {
                throw new UnauthorizedException({ statusCode: 401, message: 'User is disabled.' });
            }
            else if (user.status == 1) {
                throw new UnauthorizedException({ statusCode: 401, message: 'User is not verified.' });
            }
            const permissions = await this.userService.generatePermissions(user)
            console.log(permissions)

            const payload = { ...user, permissions: permissions, password: undefined, sub: user.id, refreshTokenId: refresh_token.tokenId, tokenId: uuid() };
            return {
                access_token: this.jwtService.sign(payload, {
                    expiresIn: '1 Days'
                })
            };
        }
    }
}
