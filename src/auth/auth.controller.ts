import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/helpers/user.decorator';
import { ValidatedBody } from 'src/helpers/Validators';
import { AuthService } from './auth.service';
import { CLoginDTO } from './dto/CLoginDTO';
import { CUserDTO } from './dto/CUserDTO';
import { CValidateToken } from './dto/CValidateToken';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private service:AuthService){}
    @Post("login")
    async login(@ValidatedBody() body:CLoginDTO){
        return await this.service.login(body);
    }
    @Post("validate")
    async validate(@Body() token:CValidateToken){
        return this.service.validate(token)
    }
    @Post("logout")
    @UseGuards(JwtAuthGuard)
    async logout(@GetUser() user:CUserDTO){
        return this.service.logout(user)
    }
}
