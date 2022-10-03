import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Callback, Document, HydratedDocument, Model, Types } from 'mongoose';
import { Operation, OperationDocument } from 'src/models/Operation';
import { CCreateOperation } from './dto/ССreateOperation';
import fetch from 'node-fetch';
import { CUserDTO } from 'src/auth/dto/CUserDTO';
import { CGetList } from './dto/CGetList';
import { СUpdateOperation } from './dto/СUpdateOperation';

@Injectable()
export class OperationsService {
    constructor(
        @InjectModel(Operation.name) private readonly operationModel:Model<OperationDocument>,
      ) {
    }
  async create(operation: CCreateOperation,user:CUserDTO) {
    const {operationType,sum:sumOriginal,currency,...other} = operation;
    const isMinus = {
      Доход:1,
      Расход:-1,
    }
    const sum = isMinus[operationType]*sumOriginal
    const courceUSD = await this.getUSDCource();
    const sumUAH = ((currency=="$"?courceUSD:1)*sum).toFixed(2)
    const {_id} = await new this.operationModel({...other,sum,sumUAH,user:user.id,currency,courceUSD}).save()
    return {
      result:'success',
      id:_id
    }
  }
  private async getUSDCource(){
    const req = await fetch("https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11")
    //@ts-ignore
    const json:{
      ccy:string;
      base_ccy:string;
      buy:string;
      sale:string
    }[] = await req.json()
    const courceUSD = json.find(e=>e.ccy=="USD")
    return +courceUSD.sale
  }

  async list(options: CGetList, user: CUserDTO) {
    const {periodResult,category,operationType,priceFrom,priceTo,search} = options
    const fetchObj = {user:user.id}
    if(periodResult){
      Object.assign(fetchObj,{
        createdAt:{
          $gt:new Date(periodResult.from).getTime(),
          $lt:new Date(periodResult.to).getTime()+86400000
        }
      })
    }
    if(search){
      Object.assign(fetchObj,{
        operationName:{
          $regex:new RegExp(search??"", 'i')
        }
      })
    }
    if(operationType){
      const varObj = {
        Доход:'$gte',
        Расход:'$lte',
      }
      Object.assign(fetchObj,{
        sum:{
          [varObj[operationType]]:0
        },
      })
    }
    if(priceFrom||priceTo){
      const priceObj = {}
      if(priceFrom){
        const fieldObj = {
          Доход:'$gte',
          Расход:'$lte',
        }
        const valueObj = {
          Доход:priceFrom,
          Расход:-priceFrom,
        }
        Object.assign(priceObj,{
          [fieldObj[operationType]]:valueObj[operationType],
        })
      }
      if(priceTo){
        const fieldObj = {
          Доход:'$lte',
          Расход:'$gte',
        }
        const valueObj = {
          Доход:priceTo,
          Расход:-priceTo,
        }
        Object.assign(priceObj,{
          [fieldObj[operationType]]:valueObj[operationType],
        })
      }
      Object.assign(fetchObj,{
        sumUAH:priceObj
      })
    }
    if(category){
      Object.assign(fetchObj,{
        category:{
          $in:category.split(", ")
        }
      })
    }
    // console.log(fetchObj)
    
    const list = await this.operationModel.find(fetchObj,{},{sort:{_id:-1}}).exec()
    const result = list.map(({operationName:name,sumUAH:amount,comment,createdAt:time,_id:id})=>({name,amount,comment,time,id}))
    return result
  }

  async info(id: string, user: CUserDTO) {
    const operation = await this.operationModel.findById(id)
    if(!operation || operation.user!=user.id)throw new ForbiddenException("Operation not found")
    const {operationName,category,sum,currency,comment} = operation
    const operationType:"Доход" | "Расход" = sum>0?"Доход":"Расход"
    // console.log({operationName,category,operationType,sum:Math.abs(sum),currency,comment})
    return {operationName,category,operationType,sum:Math.abs(sum)+"",currency,comment}
  }

  async update(id: string, operationNew: СUpdateOperation, user: CUserDTO) {
    const {operationType,sum:sumOriginal,currency,...other} = operationNew;
    const operation = await this.operationModel.findById(id)
    if(!operation || operation.user!=user.id)throw new ForbiddenException("Operation not found")
    const isMinus = {
      Доход:1,
      Расход:-1,
    }
    const sum = isMinus[operationType]*sumOriginal
    const courceUSD = operation.courceUSD
    const sumUAH = +((currency=="$"?courceUSD:1)*sum).toFixed(2)
    // console.log({...other,sum,sumUAH,currency})
    await operation.updateOne({...other,sum,sumUAH,currency})
    return {
      result:'success'
    }
  }

  async delete(id:string,user: CUserDTO) {
    await this.operationModel.deleteMany({user:user.id,_id:id}).exec()
  }
}