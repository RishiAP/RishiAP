import { defineConfig, env } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DIRECT_URL || 'postgresql://dummy:dummy@localhost/dummy', // CLI uses direct connection for migrations (fallback needed for Vercel builds)
  },
});
