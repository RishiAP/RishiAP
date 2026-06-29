import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const CreateEducationSchema = z.object({
  period: z.string().min(1).max(50),
  degree: z.string().min(1).max(200),
  institution: z.string().min(1).max(200),
  description: z.string().max(500).optional().default(''),
  order: z.number().int().min(0).default(0),
});

type CreateEducationDto = z.infer<typeof CreateEducationSchema>;

function Test() {
  const form = useForm<z.input<typeof CreateEducationSchema>, any, CreateEducationDto>({
    resolver: zodResolver(CreateEducationSchema),
  });
}
