import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Security Headers ──
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // needed for Swagger UI
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // ── CORS ──
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (server-to-server, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  });

  // ── Global Prefix ──
  // Removed app.setGlobalPrefix('api') to prevent redundant /api/api routes when deployed to api.domain.com

  // ── OpenAPI / Swagger ──
  const config = new DocumentBuilder()
    .setTitle('rishicodes API')
    .setDescription(
      'Backend API for rishicodes.com portfolio — projects, blog posts, skills, education, and GitHub metadata.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(process.env.API_BASE_URL || 'http://localhost:3002', 'Current')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
  });

  // ── Start ──
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`🚀 API running on port ${port}`);
  console.log(`📖 Swagger docs at http://localhost:${port}/docs`);
}
bootstrap();
