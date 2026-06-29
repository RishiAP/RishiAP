import { Module } from '@nestjs/common';
import { RevalidationModule } from '../revalidation/revalidation.module';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { EducationAdminController } from './education.admin.controller';

@Module({
  imports: [RevalidationModule],
  controllers: [EducationController, EducationAdminController],
  providers: [EducationService],
})
export class EducationModule {}
