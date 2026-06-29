import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectsAdminController } from './projects.admin.controller';
import { RevalidationModule } from '../revalidation/revalidation.module';
import { GithubModule } from '../github/github.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [RevalidationModule, GithubModule, UploadModule],
  controllers: [ProjectsController, ProjectsAdminController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
