import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CUserDTO } from 'src/auth/dto/CUserDTO';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/helpers/user.decorator';
import { ValidatedQuery } from 'src/helpers/Validators';
import { Period } from 'src/other/dto/Period';
import { StatisticService } from './statistic.service';

@Controller('statistic')
@UseGuards(JwtAuthGuard)
export class StatisticController {
    constructor(private service:StatisticService){}
    @Get("info")
    info(@ValidatedQuery() q:Period,@GetUser() user:CUserDTO){
        return this.service.getInfo(q,user);
    }
    @Get("chart")
    async chart(@ValidatedQuery() q:Period,@GetUser() user:CUserDTO){
        const res = await this.service.getChart(q,user);
        // console.log(res)
        return res
    }
}
