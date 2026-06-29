import { Injectable, NotFoundException } from '@nestjs/common';
import { Octokit } from 'octokit';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GithubService {
  private octokit: Octokit;
  private readonly owner: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.octokit = new Octokit({
      auth: this.configService.get<string>('GITHUB_PAT'),
    });
    this.owner = this.configService.get<string>('GITHUB_OWNER') || 'RishiAP';
  }

  /**
   * Validate that a repo is linked to a project in the database,
   * or fall back to the default owner's repos.
   */
  private async resolveRepo(repoName: string): Promise<{ owner: string; repo: string }> {
    // First check if any project has this repo linked
    const project = await this.prisma.project.findFirst({
      where: { repoName: repoName },
      select: { repoOwner: true, repoName: true },
    });

    if (project?.repoName) {
      return {
        owner: project.repoOwner || this.owner,
        repo: project.repoName,
      };
    }

    // Fall back to default owner (backward compatible)
    return { owner: this.owner, repo: repoName };
  }

  async getRepoMeta(repoName: string) {
    const { owner, repo } = await this.resolveRepo(repoName);

    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      return {
        name: data.name,
        fullName: data.full_name,
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        lastPushed: data.pushed_at,
        language: data.language,
        description: data.description,
        url: data.html_url,
        topics: data.topics ?? [],
        defaultBranch: data.default_branch,
      };
    } catch {
      throw new NotFoundException(`Repo '${owner}/${repo}' not found on GitHub`);
    }
  }

  /**
   * Fetch the language byte counts for a repository and calculate percentages.
   */
  async getRepoLanguages(repoName: string): Promise<{ name: string; percentage: number }[]> {
    const { owner, repo } = await this.resolveRepo(repoName);

    try {
      const { data } = await this.octokit.rest.repos.listLanguages({
        owner,
        repo,
      });

      const languageData = data as Record<string, number>;
      const totalBytes = Object.values(languageData).reduce((acc: number, val: number) => acc + val, 0);
      if (totalBytes === 0) return [];

      const languages = Object.entries(languageData).map(([name, bytes]) => ({
        name,
        percentage: Number(((bytes / totalBytes) * 100).toFixed(1)),
      }));

      // Sort by percentage descending
      return languages.sort((a, b) => b.percentage - a.percentage);
    } catch {
      // It's not critical if language stats fail to load
      return [];
    }
  }

  /**
   * Fetch the README content for a repository.
   * Returns decoded markdown text.
   */
  async getRepoReadme(repoName: string): Promise<{ content: string; encoding: string; name: string }> {
    const { owner, repo } = await this.resolveRepo(repoName);

    try {
      const { data } = await this.octokit.rest.repos.getReadme({
        owner,
        repo,
        mediaType: { format: 'raw' },
      });

      return {
        content: data as unknown as string, // raw format returns plain text
        encoding: 'utf-8',
        name: 'README.md',
      };
    } catch {
      throw new NotFoundException(`README not found for '${owner}/${repo}'`);
    }
  }

  /**
   * Get enriched repo details: metadata + README content.
   * Used by the project detail page to display everything in one call.
   */
  async getRepoEnriched(repoName: string) {
    const [meta, readme, languages] = await Promise.allSettled([
      this.getRepoMeta(repoName),
      this.getRepoReadme(repoName),
      this.getRepoLanguages(repoName),
    ]);

    const enrichedMeta = meta.status === 'fulfilled' ? {
      ...meta.value,
      languages: languages.status === 'fulfilled' ? languages.value : [],
    } : null;

    return {
      meta: enrichedMeta,
      readme: readme.status === 'fulfilled' ? readme.value.content : null,
    };
  }
}
