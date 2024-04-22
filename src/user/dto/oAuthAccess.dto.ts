import { IsEmail, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class OAuthAccessDto {

    @IsNotEmpty({ message: 'name is required'})
    @IsString()
    name: string;

    @IsUrl()
    photo: string;

    @IsNotEmpty({ message: 'email is required'})
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'id_token is required'})
    @IsString()
    id_token: string;

    @IsNotEmpty({ message: 'role is required'})
    @IsString()
    role: string;
}