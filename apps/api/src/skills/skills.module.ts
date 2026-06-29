import { Module } from '@nestjs/common';
import { RevalidationModule } from '../revalidation/revalidation.module';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { SkillsAdminController } from './skills.admin.controller';

@Module({
  imports: [RevalidationModule],
  controllers: [SkillsController, SkillsAdminController],
  providers: [SkillsService],
})
export class SkillsModule {}
