import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { GatewayModule } from 'src/gateway/gateway.module';
@Module({
  imports:[ GatewayModule,
    JwtModule.register({
      secret:"sorry no env",
      signOptions:{expiresIn:"1d"}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
