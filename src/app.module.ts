import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { myGateway } from './gateway/gateway';

@Module({
  imports: [AuthModule,GatewayModule],
  controllers: [AppController],
  providers: [AppService, myGateway],
})
export class AppModule {}
