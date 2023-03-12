import { IsDate, IsEmail, IsNumber, IsString } from "class-validator";

export class CreateEmployeeDto {
  @IsString()
  public fullname: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public displayName: string;
}