import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EducationService } from './education.service';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  CreateEducationSchema, UpdateEducationSchema,
  CreateEducationDto, UpdateEducationDto,
  ReorderSchema, ReorderDto,
} from '@rishicodes/shared-types';

@ApiTags('Education (Admin)')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('admin/education')
export class EducationAdminController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  @ApiOperation({ summary: 'List all education entries' })
  findAll() {
    return this.educationService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create education entry' })
  @UsePipes(new ZodValidationPipe(CreateEducationSchema))
  create(@Body() dto: CreateEducationDto) {
    return this.educationService.create(dto);
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Reorder education entries' })
  @UsePipes(new ZodValidationPipe(ReorderSchema))
  reorder(@Body() items: ReorderDto) {
    return this.educationService.reorder(items);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update education entry' })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateEducationSchema)) dto: UpdateEducationDto,
  ) {
    return this.educationService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete education entry' })
  delete(@Param('id') id: string) {
    return this.educationService.delete(id);
  }
}
