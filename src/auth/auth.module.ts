import appConfig from 'src/config/app.config';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ResetTokenModule } from 'src/reset-token/reset-token.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ResetTokenModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: appConfig().jwtSecret,
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
