import { IsJWT } from "class-validator";

export class CValidateToken{
    @IsJWT()
    token:string
}