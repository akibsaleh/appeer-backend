import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export type role = "STUDENT" | "TEACHER";

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
