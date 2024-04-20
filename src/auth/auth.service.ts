import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstant } from './constants';
import { Request } from 'express';
import { LoginUserDto } from 'src/user/dto/loginUser.dto';
import { RegisterDto } from '../user/dto/registerUser.dto';
import { ResetTokenService } from 'src/reset-token/reset-token.service';
import { UpdatePasswordDto } from 'src/user/dto/updatePassword.dto';

interface LoginResponse {
  id: string;
  email: string;
  password: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private resetTokenService: ResetTokenService
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
      secret: jwtConstant.secret,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: jwtConstant.refreshSecret,
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
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: jwtConstant.refreshSecret,
    });

    const user = await this.userService.findOne(payload.email);

    if (
      !user ||
      user.refreshToken !== refreshToken ||
      user.refreshTokenExpiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role, type: 'access' },
      { expiresIn: '15m' },
    );

    const newRefreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role, type: 'refresh' },
      { expiresIn: '7d' },
    );

    await this.userService.updateRefreshToken(
      user.id,
      newRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, role } = registerDto;

    const duplicate = await this.userService.findOne(email);
    if (duplicate)
      return {
        error: new HttpException('Duplicate email', HttpStatus.BAD_REQUEST),
      };

    return this.userService.create(email, password, role);
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
    const {email, password, token} = updatePasswordDto;
    const isToken = await this.resetTokenService.findOne(email);

    if(!isToken || isToken.resetToken !== token) throw new UnauthorizedException('Invalid Token');

    const isExpired = this.jwtService.decode(token);

    return this.userService.updatePassword(isExpired.sub, password);
  }
}
