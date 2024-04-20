import { Module } from '@nestjs/common';
import { ResetTokenService } from './reset-token.service';
import { ResetTokenController } from './reset-token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResetToken, ResetTokenSchema } from './schema/reset-token.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ResetToken.name, schema: ResetTokenSchema}])],
  controllers: [ResetTokenController],
  providers: [ResetTokenService],
  exports: [ResetTokenService]
})
export class ResetTokenModule {}
