import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GithubService } from './github.service';

@ApiTags('GitHub')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repo/:name')
  @ApiOperation({ summary: 'Get GitHub repo metadata (stars, last push, etc.)' })
  @ApiParam({ name: 'name', description: 'Repository name' })
  getRepoMeta(@Param('name') name: string) {
    return this.githubService.getRepoMeta(name);
  }

  @Get('repo/:name/readme')
  @ApiOperation({ summary: 'Get the README content for a repository' })
  @ApiParam({ name: 'name', description: 'Repository name' })
  getRepoReadme(@Param('name') name: string) {
    return this.githubService.getRepoReadme(name);
  }

  @Get('repo/:name/enriched')
  @ApiOperation({ summary: 'Get repo metadata + README in one call' })
  @ApiParam({ name: 'name', description: 'Repository name' })
  getRepoEnriched(@Param('name') name: string) {
    return this.githubService.getRepoEnriched(name);
  }
}
