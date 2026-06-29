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
  const form = useForm({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      title: '',
      order: 0,
    }
  });

  function onSubmit(data: CreateProjectDto) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem><FormControl><input {...field} /></FormControl></FormItem>
          )}
        />
      </form>
    </Form>
  );
}
