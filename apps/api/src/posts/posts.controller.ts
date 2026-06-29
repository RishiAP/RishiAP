import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PostsService } from './posts.service';

@ApiTags('Posts (Public)')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'List all published blog posts' })
  findAllPublished() {
    return this.postsService.findAllPublished();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a published blog post by slug' })
  findBySlug(@Param('slug') slug: string): Promise<any> {
    return this.postsService.findBySlug(slug);
  }
}
