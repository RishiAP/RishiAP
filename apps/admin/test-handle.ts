import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const CreateProjectSchema = z.object({
  title: z.string(),
  order: z.number().int().default(0),
});

type CreateProjectDto = z.infer<typeof CreateProjectSchema>;

function Test() {
  const form = useForm<z.input<typeof CreateProjectSchema>, any, CreateProjectDto>({
    resolver: zodResolver(CreateProjectSchema),
  });

  function onSubmit(data: CreateProjectDto) {
    console.log(data);
  }

  form.handleSubmit(onSubmit); // Should have no TS error
}
