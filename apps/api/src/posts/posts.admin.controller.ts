import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  CreatePostSchema, UpdatePostSchema,
  CreatePostDto, UpdatePostDto,
} from '@rishicodes/shared-types';

@ApiTags('Posts (Admin)')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('admin/posts')
export class PostsAdminController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'List all posts (including drafts)' })
  findAll(): Promise<any> {
    return this.postsService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get post by Slug' })
  findBySlug(@Param('slug') slug: string): Promise<any> {
    return this.postsService.findByIdOrSlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @UsePipes(new ZodValidationPipe(CreatePostSchema))
  create(@Body() dto: CreatePostDto): Promise<any> {
    return this.postsService.create(dto);
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update a blog post by Slug' })
  update(
    @Param('slug') slug: string,
    @Body(new ZodValidationPipe(UpdatePostSchema)) dto: UpdatePostDto,
  ): Promise<any> {
    return this.postsService.update(slug, dto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete a blog post by Slug' })
  delete(@Param('slug') slug: string) {
    return this.postsService.delete(slug);
  }
}
