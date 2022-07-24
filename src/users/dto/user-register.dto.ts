import { IsEmail, IsString } from "class-validator";

export class UserRegisterDto {
  @IsEmail({}, { message: 'Uncorrect email' })
  email: string;

  @IsString({ message: 'Uncorrect password' })
  password: string;

  @IsString({ message: 'Uncorrect name' })
  name: string;
}