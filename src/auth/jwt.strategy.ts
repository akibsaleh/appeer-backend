import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstant } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstant.secret,
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
      secretKey: jwtConstant.refreshSecret,
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
      secretKey: jwtConstant.refreshSecret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, type: payload.type };
  }
}
