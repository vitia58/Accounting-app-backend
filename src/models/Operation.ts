import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type OperationDocument = Operation & Document;

@Schema({ timestamps: {createdAt:true,updatedAt:false} })
export class Operation {
  _id: string;

  @Prop()
  user:string

  @Prop()
  operationName:string

  @Prop()
  category:string

  // @Prop({enum:["Доход","Расход"]})
  // operationType:"Доход"|"Расход"

  @Prop()
  sum:number

  @Prop({enum:['₴','$']})
  currency:'₴'|'$'

  @Prop()
  sumUAH:number

  @Prop()
  comment:string

  @Prop()
  createdAt: number;
}
export const OperationSchema = SchemaFactory.createForClass(Operation);