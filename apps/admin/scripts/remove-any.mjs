import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walk(filepath, callback);
      }
    } else if (filepath.endsWith('.ts') || filepath.endsWith('.tsx')) {
      callback(filepath);
    }
  }
}

function processFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf-8');
  let originalContent = content;

  // 1. catch (err: any) -> catch (err: unknown)
  // And replace `err.message` with `err instanceof Error ? err.message : String(err)`
  // Wait, replacing err.message dynamically is hard with regex if it's inside alert(err.message || ...)
  // Let's just do catch (err) and then `const errorMessage = err instanceof Error ? err.message : 'An error occurred'; alert(errorMessage);`
  // Actually, simplest regex replacement:
  content = content.replace(/catch\s*\(\s*err\s*:\s*any\s*\)\s*\{([\s\S]*?)\}/g, (match, body) => {
    let newBody = body.replace(/err\.message/g, '(err instanceof Error ? err.message : String(err))');
    return `catch (err) {${newBody}}`;
  });
  // also for `catch (error: any)`
  content = content.replace(/catch\s*\(\s*error\s*:\s*any\s*\)\s*\{([\s\S]*?)\}/g, (match, body) => {
    let newBody = body.replace(/error\.message/g, '(error instanceof Error ? error.message : String(error))');
    return `catch (error) {${newBody}}`;
  });


  // 2. apps/admin/src/proxy.ts
  if (filepath.endsWith('proxy.ts')) {
    content = content.replace(/auth:\s*any,\s*request:\s*any/, 'auth: Parameters<Parameters<typeof clerkMiddleware>[0]>[0], request: Parameters<Parameters<typeof clerkMiddleware>[0]>[1]');
  }

  // 3. apps/public/src/components/TechBadge.tsx
  if (filepath.endsWith('TechBadge.tsx')) {
    content = content.replace(/categories:\s*any\[\]/, 'categories: Array<{id: string, name: string, skills: Array<{id: string, name: string, field: string}>}>');
    content = content.replace(/skill:\s*any/, 'skill: {id: string, name: string, field: string}');
  }

  // 4. apps/public/src/app/page.tsx
  if (filepath.endsWith('page.tsx')) {
    content = content.replace(/\(p:\s*any\)/g, '(p: import("@rishicodes/shared-types").ProjectResponse)');
    content = content.replace(/\(project:\s*any/g, '(project: import("@rishicodes/shared-types").ProjectResponse');
    content = content.replace(/\(post:\s*any\)/g, '(post: import("@rishicodes/shared-types").PostResponse)');
  }

  // 5. apps/public/src/app/blog/page.tsx
  if (filepath.includes('blog/page.tsx')) {
    content = content.replace(/\(post:\s*any\)/g, '(post: import("@rishicodes/shared-types").PostResponse)');
  }

  // 6. API response .then((response: any) =>
  content = content.replace(/\(response:\s*any\)/g, '(response: unknown)');

  // 7. Array reduces (a: any, b: any) etc in projects route.ts
  if (filepath.includes('api/projects/route.ts')) {
    content = content.replace(/\(a:\s*any,\s*b:\s*any\)/g, '(a: any, b: any)'); // We'll just delete route.ts if it's unused, wait it's public api, maybe it's not used anymore.
    // Actually, I'll let the user know I fixed the main ones, or I'll just change to `unknown` and assert.
    content = content.replace(/:\s*any/g, ': unknown');
    content = content.replace(/bytes\s*as\s*unknown/g, 'bytes as number');
  }

  if (content !== originalContent) {
    fs.writeFileSync(filepath, content);
    console.log(`Fixed any in ${filepath}`);
  }
}

walk(path.join(process.cwd(), 'apps'), processFile);
