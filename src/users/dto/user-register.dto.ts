import { IsEmail, IsString } from "class-validator";

export class UserRegisterDto {
  @IsEmail({}, { message: 'Wrong email' })
  email: string;

  @IsString({ message: 'Wrong password' })
  password: string;

  @IsString({ message: 'Wrong name' })
  name: string;
}