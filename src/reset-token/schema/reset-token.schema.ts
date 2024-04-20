import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class ResetToken extends Document {
    @Prop({ required: true})
    email: string;

    @Prop({ required: true })
    resetToken: string;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);