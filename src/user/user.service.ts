import { Injectable } from '@nestjs/common';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(email: string, password: string, role: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = new this.userModel({ email, password: hashedPassword, role });
    return createUser.save();
  }

  async findOne(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
    refreshTokenExpiresAt: Date,
  ) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { refreshToken, refreshTokenExpiresAt },
        { new: true },
      )
      .exec();
  }

  async updatePassword( userId: string, password: string){
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userModel.findByIdAndUpdate(userId, {password: hashedPassword}).exec();
  }
}