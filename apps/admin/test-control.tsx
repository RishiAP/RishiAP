import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from './src/components/ui/form';

const CreateProjectSchema = z.object({
  title: z.string(),
  order: z.number().int().default(0),
});

type CreateProjectDto = z.infer<typeof CreateProjectSchema>;

export default function Test() {
  const form = useForm<z.input<typeof CreateProjectSchema>, any, CreateProjectDto>({
    resolver: zodResolver(CreateProjectSchema),
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem><FormControl><input {...field} /></FormControl></FormItem>
        )}
      />
    </Form>
  );
}
