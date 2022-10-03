import { IsMongoId } from "class-validator";

class CGetOperationInfo{
    @IsMongoId()
    id:string
}