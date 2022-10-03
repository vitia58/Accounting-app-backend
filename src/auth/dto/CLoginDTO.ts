import { IsEmail, IsString, Length } from "class-validator";

export class CLoginDTO{
    @IsString()
    login:string

    @IsString()
    password:string
}