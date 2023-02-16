import { PrismaClient, Profile } from "@prisma/client";
import { CreateProfileDto } from '../dtos/createProfile.dto';
import { HttpException } from '../exceptions/HttpException';
import { LoginDto } from "../dtos/login.dto";
import { TokenData, DataStoredInToken } from '../interfaces/auth.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { ResponseData } from "../config/ResponseData.config";
require("dotenv").config();

class AuthenticationService {
  public profile = new PrismaClient().profile;

  public createAccessToken(profile: Profile): TokenData {
    try {
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
    } catch (err) {
      throw new HttpException(500, "Server error")
    }
  }

  public createRefreshToken(profile: Profile): TokenData {
    try {
      const expiresIn: number = Number.parseInt(process.env.REFRESH_EXPIRED);
      const secret = process.env.REFRESH_KEY;
      const dataStoredInToken: DataStoredInToken = {
        id: profile.id,
      }
      return {
        expiresIn,
        token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
      };
    } catch (err) {
      throw new HttpException(500, "Server error")
    }
  }

  public async registration(profileData: CreateProfileDto): Promise<String> {
    try {
      const findProfile: Profile = await this.profile.findUnique({
        where: {
          email: profileData.email
        }
      })
      if (findProfile) throw new HttpException(409, `This email ${profileData.email} already exists`);
      const hashedPassword = await bcrypt.hash(profileData.password, 10);
      const createProfileData = await this.profile.create({
        data: {
          ...profileData, password: hashedPassword
        }
      });

      return "success";
    } catch (err) {
      throw new HttpException(500, "Server error")
    }
  }

  public async login(loginData: LoginDto): Promise<String> {
    try {
      const findProfile: Profile = await this.profile.findUnique({
        where: {
          email: loginData.email
        }
      })
      if (!findProfile) throw new HttpException(409, `This email ${loginData.email} was not found`);

      const isPasswordMatching = await bcrypt.compare(loginData.password, findProfile.password);
      if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");
      findProfile.password = undefined;
      const tokenData = this.createAccessToken(findProfile);
      return tokenData.token;
    } catch (err) {
      throw new HttpException(500, "Server error")
    }
  }

  public async logout(profile_id: string): Promise<boolean> {
    try {
      const response = new ResponseData<boolean>();
      //delete refresh token
      return;
    } catch (err) {
      throw new HttpException(500, "Server error")
    }
  }

  public async refreshToken(profile_id: string, refreshToken: string): Promise<void> {
    try {
      //check if the token is expired or not

      //Get the token from database and compare refresh

      //update the refresh token in database
      const hashedRefreshToken = await argon2.hash(refreshToken);
      //save refreshtoken to db
      return; 
    } catch (err) {
      throw new HttpException(500, "Server error")
    }
  }
}

export default AuthenticationService;