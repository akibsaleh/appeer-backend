import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { role } from '../dto/loginUser.dto';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {

  @Prop({ required: true })
  name: string;

  @Prop()
  photo: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  role: role;

  @Prop()
  refreshToken: string;

  @Prop()
  refreshTokenExpiresAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
