'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '~components/ui/button';
import { POMODORO_SETTING_DEFAULT } from '~constants/pomodoro';
import { usePomodoroSetting } from '~hooks/usePomodoroSetting';
import { Checkbox } from '~ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~ui/form';
import { Input } from '~ui/input';
import { onChangeInputNumber } from '~utils/shadcnHelpers';

const formSchema = z.object({
  workDuration: z.number(),
  shortBreakDuration: z.number().min(0, 'Akiiiiiiiiii'),
  longBreakDuration: z.number().min(0, 'Akiiiiiiiiii'),
  longBreakInterval: z.number().min(0, 'Akiiiiiiiiii'),
  autoStartPomodoro: z.boolean(),
  autoStartBreak: z.boolean(),
});

const PomodoroSetting = () => {
  const t = useTranslations('PomodoroSetting');
  const { handleUpdate } = usePomodoroSetting();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workDuration: POMODORO_SETTING_DEFAULT.workDuration,
      shortBreakDuration: POMODORO_SETTING_DEFAULT.shortBreakDuration,
      longBreakDuration: POMODORO_SETTING_DEFAULT.longBreakDuration,
      longBreakInterval: POMODORO_SETTING_DEFAULT.longBreakInterval,
      autoStartPomodoro: POMODORO_SETTING_DEFAULT.autoStartPomodoro,
      autoStartBreak: POMODORO_SETTING_DEFAULT.autoStartBreak,
    },
  });

  const onSubmit = (values: any) => {
    handleUpdate(values);
  };

  return (
    <div className="w-full max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="workDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('workDuration')}</FormLabel>
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
                <FormLabel>{t('shortBreakDuration')}</FormLabel>
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
                <FormLabel>{t('longBreakDuration')}</FormLabel>
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
                <FormLabel>{t('longBreakInterval')}</FormLabel>
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
            name="autoStartPomodoro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('autoStartPomodoro')}</FormLabel>
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
                <FormLabel>{t('autoStartBreak')}</FormLabel>
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

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default PomodoroSetting;
