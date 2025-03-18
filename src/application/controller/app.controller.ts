import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AppService } from '../../domain/service/app.service';
import { Response } from 'express';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '@ababank/auth';

@Controller('deeplink')
export class AppController {
  constructor(
    @Inject('DEEPLINK_SERVICE') private client: ClientProxy,
    private readonly appService: AppService,
  ) {}

  @Get('/:slug')
  async read(@Param('slug') slug: string, @Res() res: Response): Promise<void> {
    const url = await this.appService.read(slug);
    res.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  @UseGuards(AuthGuard)
  @Post()
  async write(
    @Body() body: { url: string; expiresAt?: Date },
  ): Promise<{ deeplink: string }> {
    return firstValueFrom(this.client.send({ cmd: 'generate_deeplink' }, body));
  }

  @MessagePattern({ cmd: 'generate_deeplink' })
  async deeplink(
    @Payload() payload: { url: string; expiresAt?: Date },
  ): Promise<{ deeplink: string }> {
    /**
     * If you want to validate the URL before writing it to the cache, you can use the following code:
     * const validated = isExist(body.url);
     * if (!validated) {
     *  throw new RpcException('URL does not exist');
     * }
     **/
    const url = await this.appService.write(payload.url, {
      expiresAt: new Date(payload.expiresAt),
    });
    return {
      deeplink: url,
    };
  }
}
