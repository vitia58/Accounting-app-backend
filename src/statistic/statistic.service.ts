import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import e from 'express';
import { Model } from 'mongoose';
import { CUserDTO } from 'src/auth/dto/CUserDTO';
import { Operation, OperationDocument } from 'src/models/Operation';
import { Period } from 'src/other/dto/Period';
import moment from 'moment';

@Injectable()
export class StatisticService {
  constructor(
      @InjectModel(Operation.name) private readonly operationModel:Model<OperationDocument>,
    ) {
    }
  async getInfo(period:Period, user:CUserDTO){
    const list = await this.operationModel.find({
      user: user.id,
      createdAt: {
        $gt: new Date(period.from).getTime(),
        $lt: new Date(period.to).getTime() + 86400000,
      },
    }).exec();
    const priceList = list.map(e=>e.sumUAH)
    const earnList = priceList.filter(e=>e>0)
    const earn = earnList.length==0?0:earnList.reduce((p,c)=>p+c)
    const loseList = priceList.filter(e=>e<0)
    const lose = loseList.length==0?0:-loseList.reduce((p,c)=>p+c)
    const dif = (earn-lose).toFixed(2);
    const percent = Math.round(lose==0?0:earn/lose*100)
    console.log({
      earn,
      lose,
      dif,
      percent,
    })
    return {
      earn,
      lose,
      dif,
      percent,
    };
  }
  async getChart(period:Period, user:CUserDTO){
    //moment(period.from, "YYYY-MM-DD")
    const fromTime = new Date(period.from).getTime()
    const splitTime = (from:number,to:number,divides:number,formater:(start:number,end:number)=>string)=>{
      const dif = to-from
      const step = dif/divides
      return [...Array(divides).keys()].map(e=>e*step+from).map(e=>({from:e,to:e+step-1,name:formater(e,e+step-1)}))
    }
    const find = async (period:{from:number,to:number,name:string})=>{
      const list = await this.operationModel.find({
        user: user.id,
        createdAt: {
          $gt: period.from,
          $lt: period.to,
        },
      }).exec();
      if(list.length==0)return {earn:0,lose:0,name:period.name}
      const priceList = list.map(e=>e.sumUAH)
      const earnList = priceList.filter(e=>e>0)
      const earn = earnList.length==0?0:earnList.reduce((p,c)=>p+c)
      const loseList = priceList.filter(e=>e<0)
      const lose = loseList.length==0?0:-loseList.reduce((p,c)=>p+c)
      return {earn,lose,name:period.name}
    }
    const {type,from,to} = period
    switch(type){
      case "7days":{
        const days = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]
        return Promise.all(
          splitTime(
            new Date(from).getTime(),
            new Date(to).getTime(),
            7,
            (time)=>days[new Date(time).getDay()]
          ).map(find)
        )
      }
      case "1month":{
        return Promise.all(
          splitTime(
            new Date(from).getTime(),
            new Date(to).getTime(),
            6,
            (from,to)=>`${new Date(from).getDate()}-${new Date(to).getDate()}`
          ).map(find)
        )
      }
    }
  }
}
