import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LoginUserDto } from 'src/user/dto/loginUser.dto';
import { RegisterDto } from '../user/dto/registerUser.dto';
import { ResetTokenService } from 'src/reset-token/reset-token.service';
import { UpdatePasswordDto } from 'src/user/dto/updatePassword.dto';
import { OAuthAccessDto } from 'src/user/dto/oAuthAccess.dto';
import appConfig from 'src/config/app.config';

interface LoginResponse {
  id: string;
  email: string;
  password: string;
  role: string;
  photo: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private resetTokenService: ResetTokenService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    const passMatch = await bcrypt.compare(pass, user.password);
    if (user && passMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    req: Request,
    loginUserDto: LoginUserDto,
  ): Promise<LoginResponse> {
    const user = await this.userService.findOne(loginUserDto.email);
    const passwordMatch = bcrypt.compare(loginUserDto.password, user.password);
    if (!passwordMatch) return null;
    const payload = { email: user.email, sub: user._id, role: user.role };
    // Access Token Payload
    const accessTokenPayload = {
      ...payload,
      type: 'access',
    };

    // Refresh Token Payload
    const refreshTokenPayload = {
      ...payload,
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: appConfig().jwtSecret,
      expiresIn: '24h',
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: appConfig().jwtResetSecret,
      expiresIn: '7d',
    });

    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    await this.userService.updateRefreshToken(
      user.id,
      refreshToken,
      refreshTokenExpiresAt,
    );

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
      photo: user.photo,
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
  }> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: appConfig().jwtRefreshSecret,
    });

    const user = await this.userService.findOne(payload.email);

    let newAccessToken = '';
    let newRefreshToken = '';

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (user.refreshTokenExpiresAt > new Date()) {
      newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email, role: user.role, type: 'access' },
        { expiresIn: '15m' },
      );

      return {
        accessToken: newAccessToken,
        refreshToken: refreshToken,
        refreshTokenExpiresAt: user.refreshTokenExpiresAt,
      };
    }

    newAccessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role, type: 'access' },
      { expiresIn: '15m' },
    );

    newRefreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role, type: 'refresh' },
      { expiresIn: '7d' },
    );

    await this.userService.updateRefreshToken(
      user.id,
      newRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  }

  async register(registerDto: RegisterDto) {
    const { name, photo, email, password, role } = registerDto;

    const duplicate = await this.userService.findOne(email);
    if (duplicate)
      return {
        error: new HttpException('Duplicate email', HttpStatus.BAD_REQUEST),
      };

    return this.userService.create(name, photo, email, password, role);
  }

  async oAuthAccess(oAuthAccessDto: OAuthAccessDto) {
    const { name, photo, email, id_token, role } = oAuthAccessDto;
    let user = await this.userService.findOne(email);
    if (!user) {
      const googleIdToken =
        await this.userService.verifyGoogleIdToken(id_token);
      if (googleIdToken)
        user = await this.userService.oAuthCreate(name, photo, email, role);
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    const accessTokenPayload = { ...payload, type: 'access' };

    const refreshTokenPayload = { ...payload, type: 'refresh' };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: appConfig().jwtSecret,
      expiresIn: '24h',
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: appConfig().jwtRefreshSecret,
      expiresIn: '7d',
    });

    const dbUser = await this.userService.updateRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return {
      name: dbUser.name,
      photo: dbUser.photo,
      email: dbUser.email,
      role: dbUser.role,
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: dbUser.refreshTokenExpiresAt,
    };
  }

  async passwordReset(email: string) {
    const user = await this.userService.findOne(email);
    if (!user)
      return {
        message: 'No user found',
        error: 'Bad Request',
        statusCode: 400,
      };

    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role, type: 'reset' },
      { expiresIn: '1h' },
    );

    return this.resetTokenService.create(email, resetToken);
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<any> {
    const { email, password, token } = updatePasswordDto;
    const isToken = await this.resetTokenService.findOne(email);

    if (!isToken || isToken.resetToken !== token)
      throw new UnauthorizedException('Invalid Token');

    const isExpired = this.jwtService.decode(token);

    return this.userService.updatePassword(isExpired.sub, password);
  }
}
