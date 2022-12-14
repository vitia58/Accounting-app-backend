import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Operation, OperationSchema } from 'src/models/Operation';
import { User, UserSchema } from '../models/User';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports:[
    JwtModule.register({
      secret: "eI84r5^mf@Dp",
      signOptions: { expiresIn: '365d' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Operation.name, schema: OperationSchema }
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
