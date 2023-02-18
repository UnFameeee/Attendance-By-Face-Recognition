import { IsEmail, IsString } from "class-validator";

export class CreateProfileDto {
  @IsString()
  public username: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}