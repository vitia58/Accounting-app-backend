import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Operation, OperationSchema } from 'src/models/Operation';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Operation.name, schema: OperationSchema }
    ]),
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
