import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResetToken } from './schema/reset-token.schema';
import { Model } from 'mongoose';

@Injectable()
export class ResetTokenService {
  constructor(
    @InjectModel(ResetToken.name) private resetTokenModel: Model<ResetToken>,
  ) {}

  async create(email: string, token: string): Promise<ResetToken> {
    const createToken = new this.resetTokenModel({ email, resetToken: token });
    return createToken.save();
  }

  async findOne(email: string): Promise<ResetToken> {
    return this.resetTokenModel.findOne({ email });
  }
}
