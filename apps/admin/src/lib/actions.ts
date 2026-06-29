"use server";

import { fetchApi as serverFetchApi } from './api-client';

// This server action wraps the server-side fetchApi so that Client Components
// can call it without importing @clerk/nextjs/server directly.
export async function fetchApiAction<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    return await serverFetchApi<T>(endpoint, options);
  } catch (err: any) {
    // Next.js Server Actions swallow error details unless explicitly thrown as string or simple object
    const fs = require('fs');
    fs.appendFileSync('/home/rishi/Documents/dev/RishiAP/apps/admin/error.log', new Date().toISOString() + ': ' + (err.message || 'Unknown error') + '\n');
    throw new Error(err.message || 'An error occurred during API request');
  }
}
