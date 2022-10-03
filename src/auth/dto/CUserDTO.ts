import { IsString } from 'class-validator';
import { User } from 'src/models/User';
export type CUserDTO = Omit<User, "password"|"__v"|"_id"> & {id:string}