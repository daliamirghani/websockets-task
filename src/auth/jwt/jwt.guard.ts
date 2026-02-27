import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class WsJwtAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        //ill override this method to return client instead of request
        const client = context.switchToWs().getClient();
        return client.handshake;
        
    }
    handleRequest(err, user, info, context: ExecutionContext) {
        const client = context.switchToWs().getClient();
        if (err || !user) {
            throw new UnauthorizedException();
        }
        client.data.user = user;

        return user;
  }
}