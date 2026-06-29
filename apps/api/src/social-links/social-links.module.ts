import { Module } from '@nestjs/common';
import { SocialLinksService } from './social-links.service';
import { SocialLinksController } from './social-links.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RevalidationModule } from '../revalidation/revalidation.module';

@Module({
  imports: [PrismaModule, RevalidationModule],
  controllers: [SocialLinksController],
  providers: [SocialLinksService],
})
export class SocialLinksModule {}
