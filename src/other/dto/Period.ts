import { IsDateString, Matches } from "class-validator";

export class Period{
    @Matches(/\d{4}-\d{2}-\d{2}/)
    from:string

    @Matches(/\d{4}-\d{2}-\d{2}/)
    to:string

    @Matches(/(\d+days)|(\d+month)|(custom)/)
    type:"7days"|"1month"|"3month"|"6month"|"12month"|"custom"
}