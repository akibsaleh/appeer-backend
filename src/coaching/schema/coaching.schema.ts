import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Coaching extends Document {
    @Prop({ required: true})
    name: string;

    @Prop({ required: true})
    description: string;

    @Prop({ required: true })
    pricing: number;

    @Prop()
    image: string;
}

export const CoachingSchema = SchemaFactory.createForClass(Coaching);