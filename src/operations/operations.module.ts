import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Operation, OperationSchema } from 'src/models/Operation';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Operation.name, schema: OperationSchema }
    ]),
  ],
  controllers: [OperationsController],
  providers: [OperationsService]
})
export class OperationsModule {}
