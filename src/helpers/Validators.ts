import { Body, createParamDecorator, ExecutionContext, Query, ValidationPipe, ValidationPipeOptions } from "@nestjs/common";

export const ValidatedBody = (options: ValidationPipeOptions={whitelist:true,forbidNonWhitelisted:true,transform:true})=>Body(new ValidationPipe(options))
export const ValidatedQuery = (options: ValidationPipeOptions={whitelist:true,forbidNonWhitelisted:true,transform:true})=>Query(new ValidationPipe(options))