import { Injectable } from '@nestjs/common';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { OAuth2Client } from 'google-auth-library';
import appConfig from 'src/config/app.config';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    name: string,
    photo: string,
    email: string,
    password: string,
    role: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = new this.userModel({
      name,
      photo,
      email,
      password: hashedPassword,
      role,
    });
    return createUser.save();
  }

  async oAuthCreate(
    name: string,
    photo: string,
    email: string,
    role: string,
  ): Promise<User> {
    const createUser = new this.userModel({
      name,
      photo,
      email,
      role,
    });
    return createUser.save();
  }

  async findOne(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken?: string,
    refreshTokenExpiresAt?: Date,
  ) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { refreshToken, refreshTokenExpiresAt },
        { new: true },
      )
      .exec();
  }

  async updatePassword(userId: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userModel
      .findByIdAndUpdate(userId, { password: hashedPassword })
      .exec();
  }

  async verifyGoogleIdToken(id_token: string) {
    const client = new OAuth2Client();
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: appConfig().googleClientId,
      });
      const payload = ticket.getPayload();
      return payload['sub'];
    }

    try {
      const res = await verify();
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}
