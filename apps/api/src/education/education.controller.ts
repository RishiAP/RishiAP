import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EducationService } from './education.service';

@ApiTags('Education (Public)')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all education entries' })
  findAll() {
    return this.educationService.findAll();
  }
}
