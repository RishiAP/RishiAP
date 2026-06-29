import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pagesDir = path.join(__dirname, '../src/app/(dashboard)');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('posts/[id]/edit')) {
      processFile(fullPath);
    } else if (fullPath.endsWith('.tsx') && fullPath.includes('posts/[id]/edit')) {
      // Handle the special case where we also set value with 'as any'
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 1. Remove ' as any' from resolver
  content = content.replace(/resolver:\s*zodResolver\(([^)]+)\)\s*as\s*any,/g, 'resolver: zodResolver($1),');
  
  // 2. Remove ' as any' from onSubmit
  content = content.replace(/onSubmit={form\.handleSubmit\(onSubmit\s*as\s*any\)}/g, 'onSubmit={form.handleSubmit(onSubmit)}');
  
  // 3. Remove ' as any' from control
  content = content.replace(/control={form\.control\s*as\s*any}/g, 'control={form.control}');

  // 4. Remove ' as any' from JSON.stringify cast (in edit post)
  content = content.replace(/JSON\.stringify\(([^)]+)\)\s*as\s*any/g, 'JSON.stringify($1)');

  // 5. Update useForm generics
  // Look for useForm<SomeDto>({
  const useFormRegex = /useForm<([^>]+)>\(\{/g;
  const match = useFormRegex.exec(content);
  if (match) {
    const dtoType = match[1];
    
    // Attempt to guess the schema name from the DTO name. E.g. CreateProjectDto -> CreateProjectSchema
    let schemaName = dtoType.replace('Dto', 'Schema');
    if (dtoType.endsWith('Dto')) {
      content = content.replace(useFormRegex, `useForm<z.input<typeof ${schemaName}>, any, ${dtoType}>({`);
      
      // Also need to import `z` if not present
      if (!content.includes("import type { z } from 'zod';") && !content.includes("import { z } from 'zod';")) {
        // add after import react-hook-form
        content = content.replace(/(import { useForm } from 'react-hook-form';)/, "$1\nimport type { z } from 'zod';");
      }
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

processDirectory(pagesDir);
