import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserSchema } from '../models/User';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('MONGODB_URI'),
          }),
          inject: [ConfigService],
        }),
        JwtModule.register({
          secret: "eI84r5^mf@Dp",
          signOptions: { expiresIn: '365d' },
        }),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema }
        ]),
      ],
      controllers: [AuthController],
      providers: [AuthService]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it("can login",async ()=>{
    const test = {login:"vitia",password:"12345"}
    const result = await service.login(test)
    expect(result.password).toBeNull()
  })
  it("test incorect password",async ()=>{
    const test = {login:"vitia",password:"1234567"}
    const result = await service.login(test)
    expect(result.password).toEqual("Пароль введён не верно")
  })
});
