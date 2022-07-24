import { IsEmail, IsString } from "class-validator";

export class UserLoginDto {
  @IsEmail({}, { message: 'Uncorrect email' })
  email: string;

  @IsString({ message: 'Wrong password' })
  password: string;
}