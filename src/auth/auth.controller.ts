import { Body, Controller, Post } from '@nestjs/common';
import { ValidatedBody } from 'src/helpers/Validators';
import { AuthService } from './auth.service';
import { CLoginDTO } from './dto/CLoginDTO';
import { CValidateToken } from './dto/CValidateToken';

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
}
