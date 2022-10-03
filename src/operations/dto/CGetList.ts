import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Period } from "src/other/dto/Period";

export class CGetList{

    @IsObject()
    @IsOptional()
    @Transform((v)=>v.value&&JSON.parse(v.value))
    periodResult?:Period;

    @IsString()
    @IsOptional()
    category?: string;

    @IsEnum(["Доход","Расход"])
    @IsOptional()
    operationType?: "Доход"|"Расход";

    @IsNumber()
    @IsOptional()
    @Transform(e=>e.value==undefined?undefined:+e.value)
    priceFrom?:number

    @IsNumber()
    @IsOptional()
    @Transform(e=>e.value==undefined?undefined:+e.value)
    priceTo?: number;

    @IsString()
    @IsOptional()
    search?: string;

}