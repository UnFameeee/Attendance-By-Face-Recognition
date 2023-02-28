import { IsDate, IsEmail, IsNumber, IsString } from "class-validator";

export class CreateProfileDto {
  @IsString()
  public username: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public gender: string;
  @IsNumber()
  public phoneNumber: number;
  @IsString()
  public role: string;
  @IsString()
  public picture: string;
  @IsString()
  public address: string;
  @IsString()
  public description: string;
  @IsDate()
  public dateOfBirth: Date;
  @IsDate()
  public joiningDate: Date;

}