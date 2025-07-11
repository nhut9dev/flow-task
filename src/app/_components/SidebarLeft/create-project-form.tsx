'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { SelectIcon } from '~components/SelectIcon';
import { useToast } from '~hooks/useToast';
import { useFolderStore } from '~stores/folderStore';
import { useProjectStore } from '~stores/projectStore';
import { Button } from '~ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~ui/form';
import { Input } from '~ui/input';

const formSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  icon: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProjectFormProps {
  children: React.ReactNode;
  folderId?: string | null;
}

export function CreateProjectForm({ children, folderId }: CreateProjectFormProps) {
  const createProject = useProjectStore((state) => state.createProject);
  const folders = useFolderStore((state) => state.folders);
  const showToast = useToast();
  const t = useTranslations('Project');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createProject({
        name: values.name,
        icon: values.icon,
        folderId: folderId || undefined,
      });

      // Update folder's projectIds if project is assigned to a folder
      if (folderId) {
        const currentFolder = folders.find((f) => f.id === folderId);
        if (currentFolder) {
          // Note: This would need to be updated when we have the actual project ID from API
          // For now, we'll skip this until we have proper folder-project relationship
        }
      }

      form.reset();
      showToast({
        title: 'Success',
        description: t('projectCreated'),
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : t('projectCreationFailed'),
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createProject')}</DialogTitle>
          <DialogDescription>
            Enter a name and choose an icon for your new project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('projectName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('projectNamePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('icon')}</FormLabel>
                  <FormControl>
                    <SelectIcon {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{t('createProject')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
