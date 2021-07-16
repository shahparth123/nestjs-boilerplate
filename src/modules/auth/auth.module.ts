import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../../guards/local/local.strategy';
import { JwtStrategy } from '../../guards/jwt/jwt.strategy';
import * as config from 'config';

@Module({
  imports: [forwardRef(() => UserModule), PassportModule, JwtModule.register({
    secret: config.has("secret.jwtSecret") ? config.get("secret.jwtSecret") : process.env.JWT_SECRET,
    signOptions: { expiresIn: '30 Days' },
  }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
