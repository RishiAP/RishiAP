import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsAdminController } from './posts.admin.controller';
import { RevalidationModule } from '../revalidation/revalidation.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [RevalidationModule, UploadModule],
  controllers: [PostsController, PostsAdminController],
  providers: [PostsService],
})
export class PostsModule {}
