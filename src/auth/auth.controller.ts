import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from 'src/user/dto/loginUser.dto';
import { Request } from 'express';
import { RegisterDto } from '../user/dto/registerUser.dto';
import { MongooseError } from 'mongoose';
import { UpdatePasswordDto } from 'src/user/dto/updatePassword.dto';
import { OAuthAccessDto } from 'src/user/dto/oAuthAccess.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(req, loginUserDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      return user;
    } catch (error) {
      if (error instanceof MongooseError) {
        return error;
      }
      throw error;
    }
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('reset-password')
  async reset(@Body('email') email: string) {
    return this.authService.passwordReset(email);
  }

  @Post('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto);
  }

  @Post('oauthentication')
  async verifyOauth(@Body() oAuthAccessDto: OAuthAccessDto) {
    return this.authService.oAuthAccess(oAuthAccessDto);
  }
}