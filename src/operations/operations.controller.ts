import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CUserDTO } from 'src/auth/dto/CUserDTO';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/helpers/user.decorator';
import { ValidatedBody, ValidatedQuery } from 'src/helpers/Validators';
import { CGetList } from './dto/CGetList';
import { CCreateOperation } from './dto/ССreateOperation';
import { OperationsService } from './operations.service';

@Controller('operations')
@UseGuards(JwtAuthGuard)
export class OperationsController {
    constructor(private service:OperationsService){}
    @Post("create")
    create(@ValidatedBody() operation:CCreateOperation,@GetUser() user:CUserDTO){
        return this.service.create(operation,user)
    }
    @Get("list")
    list(@ValidatedQuery() options:CGetList,@GetUser() user:CUserDTO){
        console.log(options)
        return this.service.list(options,user)
    }
}
