import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { PostsModule } from './posts/posts.module';
import { SkillsModule } from './skills/skills.module';
import { EducationModule } from './education/education.module';
import { ExperienceModule } from './experience/experience.module';
import { GithubModule } from './github/github.module';
import { HealthModule } from './health/health.module';
import { UploadModule } from './upload/upload.module';
import { SocialLinksModule } from './social-links/social-links.module';

@Module({
  imports: [
    // ── Config ──
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    // ── Rate Limiting (multi-tier) ──
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 120, // 120 requests per minute for reads
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 20, // 20 writes per minute
      },
    ]),

    // ── Database ──
    PrismaModule,

    // ── Feature Modules ──
    ProjectsModule,
    PostsModule,
    SkillsModule,
    EducationModule,
    ExperienceModule,
    GithubModule,
    HealthModule,
    UploadModule,
    SocialLinksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
