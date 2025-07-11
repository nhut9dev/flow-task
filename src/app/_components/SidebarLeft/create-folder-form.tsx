'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { SelectIcon } from '~components/SelectIcon';
import { useToast } from '~hooks/useToast';
import { useFolderStore } from '~stores/folderStore';
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
  name: z.string().min(1, 'Folder name is required'),
  icon: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateFolderForm({ children }: { children: React.ReactNode }) {
  const createFolder = useFolderStore((state) => state.createFolder);
  const showToast = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createFolder({
        name: values.name,
        icon: values.icon,
      });
      form.reset();
      showToast({
        title: 'Success',
        description: 'Folder created successfully',
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create folder',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription>
            Enter a name and choose an icon for your new folder.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Marketing" {...field} />
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
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <SelectIcon {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
