import { HttpHeaders } from '@/constant/http-headers.constant';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import * as RequestIP from 'request-ip';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly X_REQUEST_ID = HttpHeaders.X_REQUEST_ID;
  private readonly logger: Logger = new Logger('HTTP');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const now = Date.now();
    const ip = RequestIP.getClientIp(request);
    const id =
      request.get(this.X_REQUEST_ID) || request.headers?.[this.X_REQUEST_ID];
    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            `Remote Address [${request.protocol}]: ${ip} => ${
              request.headers.origin || 'N/A'
            }`,
          );
          this.logger.log(`X-Request-ID: ${id}`);
        },
        error: (err) => {
          const msg = `${request.method} ${request.path} ${
            err.status || '500'
          } - ${Date.now() - now}ms - "${request.get('user-agent')}"`;
          if (!err.status || err.status >= 500) {
            this.logger.error(msg);
            return;
          }
          this.logger.log(
            `Remote Address [${request.protocol}]: ${ip} => ${
              request.headers.origin || 'N/A'
            }`,
          );
          this.logger.log(`X-Request-ID: ${id}`);
          this.logger.warn(msg);
        },
        complete: () => {
          const msg = `${request.method} ${request.path} ${
            response.statusCode
          } - ${Date.now() - now}ms - "${request.get('user-agent')}"`;
          this.logger.log(msg);
        },
      }),
    );
  }
}
