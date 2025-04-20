import { AppService } from '@/domain/service/app.service';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, GrpcMethod } from '@nestjs/microservices';
import { DeeplinkRequest } from '../proto/deeplink/DeeplinkRequest';
import { DeeplinkResponse } from '../proto/deeplink/DeeplinkResponse';
import { firstValueFrom } from 'rxjs';

@Controller('deeplinks')
export class DeeplinkController {
  constructor(
    @Inject('DEEPLINK_SERVICE') private client: ClientProxy,
    private readonly appService: AppService,
  ) {}

  /**
   * Create deeplink with GRPC Method
   *
   * @param data DeeplinkRequest
   * @returns
   */
  @GrpcMethod('DeeplinkService', 'Write')
  async write(data: DeeplinkRequest): Promise<DeeplinkResponse> {
    const deeplink = await this.appService.write(data.url);
    return { deeplink };
  }

  @Post()
  async _write(
    @Body() body: { url: string; expiresAt?: Date },
  ): Promise<{ deeplink: string }> {
    return firstValueFrom(this.client.send({ cmd: 'generate_deeplink' }, body));
  }
}
