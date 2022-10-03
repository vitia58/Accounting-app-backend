import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from 'src/models/User';
import { CUserDTO } from '../dto/CUserDTO';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(
    @InjectModel(User.name) private readonly userModel:Model<UserDocument>,) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "eI84r5^mf@Dp",
    });
  }
  async validate(payload:any):Promise<CUserDTO>{
    const user = await this.userModel.findById(payload.id)
    if(!user)throw new UnauthorizedException("User not found")
    const {__v,password,...res} = user.toObject()
    return {login:res.login,id:res._id+""}
  }
}