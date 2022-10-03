import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Operation, OperationDocument } from 'src/models/Operation';
import { User, UserDocument } from '../models/User';
import { comparePassword, hashPassword } from '../other/password-hasher.helper';
import { CLoginDTO } from './dto/CLoginDTO';
import { CUserDTO } from './dto/CUserDTO';
import { CValidateToken } from './dto/CValidateToken';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel:Model<UserDocument>,
        @InjectModel(Operation.name) private readonly operationModel:Model<OperationDocument>,
        private readonly jwtService:JwtService,
      ) {
    }
    async login(cLoginDTO:CLoginDTO){
        const {login,password} = cLoginDTO
        const user1 = await this.userModel.findOne({login})
        if(user1){
            if(await comparePassword(password,user1.password)){
                return {
                    password:null,
                    access_token:this.jwtService.sign({id:user1._id}),
                }
            }else return {
                password:"Пароль введён не верно",
                access_token:null,
            }
        }else{
            const user2=await new this.userModel({login,password:await hashPassword(password)}).save()
            return {
                password:null,
                access_token:this.jwtService.sign({id:user2._id}),
            }
        }
    }
    async validate(CToken: CValidateToken) {
        const {token} = CToken
        const {id} = this.jwtService.decode(token) as CUserDTO
        const exists = !!await this.userModel.exists({id}).exec()
        return {
            exists
        }
    }
    async logout(user:CUserDTO) {
        await this.userModel.findByIdAndDelete(user.id).exec()
        await this.operationModel.deleteMany({user:user.id}).exec()
        return
    }
}
