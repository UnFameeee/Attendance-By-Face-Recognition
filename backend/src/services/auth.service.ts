import { PrismaClient, Profile } from "@prisma/client";
import { CreateProfileDto } from '../dtos/createProfile.dto';
import { HttpException } from '../exceptions/HttpException';
import { compare, hash } from 'bcrypt';
import { LoginDto } from "../dtos/login.dto";
import { TokenData, DataStoredInToken } from '../interfaces/auth.interface';
import * as jwt from 'jsonwebtoken';
require
require("dotenv").config();

class AuthenticationService {
  public profile = new PrismaClient().profile;

  public createToken(profile: Profile): TokenData {
    const expiresIn: number = Number.parseInt(process.env.SECRET_EXPRIED);
    const secret = process.env.SECRET_KEY;
    const dataStoredInToken: DataStoredInToken = {
      id: profile.id,
      email: profile.email
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public async registration(profileData: CreateProfileDto): Promise<String> {
    const findProfile: Profile = await this.profile.findUnique({
      where: {
        email: profileData.email
      }
    })
    if (findProfile) throw new HttpException(409, `This email ${profileData.email} already exists`);
    const hashedPassword = await hash(profileData.password, 10);
    const createProfileData = await this.profile.create({
      data: {
        ...profileData, password: hashedPassword
      }
    });

    return "success";
  }

  public async login(loginData: LoginDto): Promise<String> {
    const findProfile: Profile = await this.profile.findUnique({
      where: {
        email: loginData.email
      }
    })
    if (!findProfile) throw new HttpException(409, `This email ${loginData.email} was not found`);

    const isPasswordMatching = await compare(loginData.password, findProfile.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");
    findProfile.password = undefined;
    const tokenData = this.createToken(findProfile);
    return tokenData.token;
  }

  
}

export default AuthenticationService;