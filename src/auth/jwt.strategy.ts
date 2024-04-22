import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import appConfig from 'src/config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig().jwtSecret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, type: payload.type };
  }
}

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretKey: appConfig().jwtRefreshSecret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, type: payload.type };
  }
}

@Injectable()
export class JwtResetTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('resetToken'),
      ignoreExpiration: false,
      secretKey: appConfig().jwtResetSecret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, type: payload.type };
  }
}
