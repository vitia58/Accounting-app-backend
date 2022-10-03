import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString, Length } from "class-validator";

export class COperation{
    @IsString()
    @IsNotEmpty()
    operationName:string

    @IsString()
    @IsNotEmpty()
    category:string

    @IsEnum(["Доход","Расход"])
    @IsNotEmpty()
    operationType:"Доход"|"Расход"

    @IsNumber()
    @Transform(e=>+e.value)
    sum:number

    @IsEnum(['₴','$'])
    @IsNotEmpty()
    currency:'₴'|'$'

    @IsString()
    comment:string
}