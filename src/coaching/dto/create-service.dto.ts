import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCoachingDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsUrl()
    image: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    pricing: string;
}
