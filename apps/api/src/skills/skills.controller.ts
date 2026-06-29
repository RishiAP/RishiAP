import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkillsService } from './skills.service';

@ApiTags('Skills (Public)')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all skill categories with skills' })
  findAll() {
    return this.skillsService.findAll();
  }
}
