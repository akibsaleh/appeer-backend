import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: 'Please enter a password' })
  @IsString({ message: 'Please enter a valid password' })
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'Password must contain at least one letter and one number',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
