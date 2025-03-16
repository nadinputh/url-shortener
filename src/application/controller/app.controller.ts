import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AppService } from '../../domain/service/app.service';
import { Response } from 'express';

@Controller('deeplink')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:slug')
  async read(@Param('slug') slug: string, @Res() res: Response): Promise<void> {
    const url = await this.appService.read(slug);
    res.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  @Post()
  async write(@Body() body: { url: string }): Promise<{ deeplink: string }> {
    /**
     * If you want to validate the URL before writing it to the cache, you can use the following code:
     * const validated = isExist(body.url);
     * if (!validated) {
     *  throw new Error('URL does not exist');
     * }
     **/
    const url = await this.appService.write(body.url);
    return {
      deeplink: url,
    };
  }
}
