import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { AppService } from '../../domain/service/app.service';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:slug')
  async read(@Param('slug') slug: string, @Res() res: Response): Promise<void> {
    const url = await this.appService.read(slug);
    if (!url) {
      res.status(HttpStatus.NOT_FOUND).send('URL not found!');
    } else {
      res.redirect(HttpStatus.MOVED_PERMANENTLY, url);
    }
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
