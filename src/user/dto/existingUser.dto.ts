import { IsEmail, IsNotEmpty } from "class-validator";

export class ExistingUserDTO {
    @IsNotEmpty()
    @IsEmail()
    readonly userEmail: string;
}