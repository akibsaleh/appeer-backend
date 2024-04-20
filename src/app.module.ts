import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CoachingModule } from './coaching/coaching.module';
import { ResetTokenController } from './reset-token/reset-token.controller';
import { ResetTokenModule } from './reset-token/reset-token.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    AuthModule,
    CoachingModule,
    ResetTokenModule
  ],
  controllers: [AppController, ResetTokenController],
  providers: [AppService],
})
export class AppModule {}
