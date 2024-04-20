import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

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
  @ValidateIf(o => o === 'STUDENT' || o === 'TEACHER', {
    message: 'role must be STUDENT or TEACHER'
  })
  role: string;
}
