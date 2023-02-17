import { PrismaClient, Profile } from "@prisma/client";
import { CreateProfileDto } from '../dtos/createProfile.dto';
import { HttpException } from '../exceptions/HttpException';
import { LoginDto } from "../dtos/login.dto";
import { TokenData, DataStoredInToken } from '../interfaces/auth.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { ResponseData } from "../config/ResponseData.config";
import { ResponseToken } from "../config/ResponseToken.config";
require("dotenv").config();

class AuthenticationService {
  public profile = new PrismaClient().profile;

  public async createAccessToken(profileData: Profile): Promise<TokenData> {
    const expiresIn: number = Number.parseInt(process.env.SECRET_EXPRIED);
    const secret = process.env.SECRET_KEY;
    const dataStoredInToken: DataStoredInToken = {
      id: profileData.id,
      email: profileData.email
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public async createRefreshToken(profileData: Profile): Promise<TokenData> {
    const expiresIn: number = Number.parseInt(process.env.REFRESH_EXPIRED);
    const secret = process.env.REFRESH_KEY;
    const dataStoredInToken: DataStoredInToken = {
      id: profileData.id,
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public async registration(profileData: CreateProfileDto): Promise<ResponseData<String>> {
    const response = new ResponseData<String>;
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
    if (createProfileData) {
      response.result = "Register successfully"
    } else {
      response.message = "Register failed, try again!"
    }
    return response;
  }

  public async generateToken(profileData: Profile): Promise<ResponseToken> {
    const response = new ResponseToken();
    const accessTokenData = await this.createAccessToken(profileData);
    const refreshTokenData = await this.createRefreshToken(profileData);
    //update the refresh token in database
    await this.profile.update({
      where: {
        id: profileData.id,
      },
      data: {
        refreshToken: await argon2.hash(refreshTokenData.token),
      }
    })

    response.access = accessTokenData.token;
    response.refresh = refreshTokenData.token;
    return response;
  }

  public async login(loginData: LoginDto): Promise<ResponseToken> {
    const findProfile: Profile = await this.profile.findUnique({
      where: {
        email: loginData.email
      }
    })
    if (!findProfile) throw new HttpException(409, `This email ${loginData.email} was not found`);

    const isPasswordMatching = await bcrypt.compare(loginData.password, findProfile.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    findProfile.password = undefined;

    return await this.generateToken(findProfile);
  }

  public async logout(profile_id: string): Promise<ResponseData<boolean>> {
    const response = new ResponseData<boolean>();
    //delete refresh token
    const queryData = await this.profile.update({
      where: {
        id: profile_id,
      },
      data: {
        refreshToken: null,
      }
    })
    response.result = queryData && true;
    return response;
  }

  public async refreshToken(profile_id: string, refreshToken: string): Promise<ResponseToken> {
    //Get the token from database and compare refresh
    const findProfile = await this.profile.findUnique({
      where: {
        id: profile_id
      }
    })
    if (!findProfile)
      throw new HttpException(401, "Access denied");

    const refreshTokenMatches = await argon2.verify(findProfile.refreshToken, refreshToken);
    if (!refreshTokenMatches)
      throw new HttpException(404, "Token invalid");

    const tokens: ResponseToken = await this.generateToken(findProfile);
    return tokens;
  }
}

export default AuthenticationService;