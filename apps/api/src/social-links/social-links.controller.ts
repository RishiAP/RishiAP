import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { SocialLinksService } from './social-links.service';
import { CreateSocialLinkDto, UpdateSocialLinkDto } from '@rishicodes/shared-types';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';

@Controller('v1/social-links')
export class SocialLinksController {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  @UseGuards(ClerkAuthGuard)
  @Post()
  create(@Body() createSocialLinkDto: CreateSocialLinkDto) {
    return this.socialLinksService.create(createSocialLinkDto);
  }

  // Public route
  @Get()
  findAll() {
    return this.socialLinksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialLinksService.findOne(id);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSocialLinkDto: UpdateSocialLinkDto,
  ) {
    return this.socialLinksService.update(id, updateSocialLinkDto);
  }

  @UseGuards(ClerkAuthGuard)
  @Put('reorder')
  reorder(@Body() items: { id: string; order: number }[]) {
    return this.socialLinksService.reorder(items);
  }

  @UseGuards(ClerkAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialLinksService.remove(id);
  }
}
