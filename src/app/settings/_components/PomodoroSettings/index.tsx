'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { usePomodoroSetting } from '~hooks/usePomodoroSetting';
import { usePomodoroStore } from '~stores/pomodoroStore';
import { Checkbox } from '~ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~ui/form';
import { Input } from '~ui/input';
import { Skeleton } from '~ui/skeleton';
import { isEqual } from '~utils/common';
import { onChangeInputNumber } from '~utils/shadcnHelpers';

const formSchema = z.object({
  workDuration: z.number(),
  shortBreakDuration: z.number().min(0),
  longBreakDuration: z.number().min(0),
  longBreakInterval: z.number().min(0),
  autoStartPomodoro: z.boolean(),
  autoStartBreak: z.boolean(),
});

const PomodoroSettings = () => {
  const tPomodoroSetting = useTranslations('PomodoroSetting');

  const { handleUpdate } = usePomodoroSetting();
  const { pomodoroSetting, isHydrated } = usePomodoroStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workDuration: pomodoroSetting.workDuration,
      shortBreakDuration: pomodoroSetting.shortBreakDuration,
      longBreakDuration: pomodoroSetting.longBreakDuration,
      longBreakInterval: pomodoroSetting.longBreakInterval,
      autoStartPomodoro: pomodoroSetting.autoStartPomodoro,
      autoStartBreak: pomodoroSetting.autoStartBreak,
    },
  });

  const onSubmit = (values: any) => {
    handleUpdate(values);
  };

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!isEqual(values, pomodoroSetting)) {
        handleUpdate(values);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, handleUpdate, pomodoroSetting]);

  useEffect(() => {
    if (isHydrated) {
      form.reset({
        workDuration: pomodoroSetting.workDuration,
        shortBreakDuration: pomodoroSetting.shortBreakDuration,
        longBreakDuration: pomodoroSetting.longBreakDuration,
        longBreakInterval: pomodoroSetting.longBreakInterval,
        autoStartPomodoro: pomodoroSetting.autoStartPomodoro,
        autoStartBreak: pomodoroSetting.autoStartBreak,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  if (!isHydrated)
    return (
      <div className="grid w-full max-w-2xl grid-cols-2 gap-4">
        <Skeleton className="h-16 w-[full rounded-xl" />
        <Skeleton className="h-16 w-[full rounded-xl" />
        <Skeleton className="h-16 w-[full rounded-xl" />
        <Skeleton className="h-16 w-[full rounded-xl" />

        <div className="space-y-4">
          <Skeleton className="h-16 w-[full rounded-xl" />
          <Skeleton className="h-16 w-[full rounded-xl" />
        </div>
      </div>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="workDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tPomodoroSetting('workDuration')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => onChangeInputNumber(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortBreakDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tPomodoroSetting('shortBreakDuration')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => onChangeInputNumber(e, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longBreakDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tPomodoroSetting('longBreakDuration')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => onChangeInputNumber(e, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longBreakInterval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tPomodoroSetting('longBreakInterval')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => onChangeInputNumber(e, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="autoStartPomodoro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tPomodoroSetting('autoStartPomodoro')}</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autoStartBreak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tPomodoroSetting('autoStartBreak')}</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PomodoroSettings;
