import { Module } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { ExperienceAdminController } from './experience.admin.controller';
import { RevalidationModule } from '../revalidation/revalidation.module';

@Module({
  imports: [RevalidationModule],
  controllers: [ExperienceController, ExperienceAdminController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
