import { Module } from '@nestjs/common';
import { AppService } from './service/app.service';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [AppService],
  exports: [AppService],
})
export class DomainModule {}
