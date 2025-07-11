import { format } from 'date-fns';
import { Calendar, Clock, Edit, Save, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { TASK_STATUS } from '~constants/task';
import { useAction } from '~hooks/useAction';
import { useToast } from '~hooks/useToast';
import { useTaskStore } from '~stores/taskStore';
import { Badge } from '~ui/badge';
import { Button } from '~ui/button';
import { Checkbox } from '~ui/checkbox';
import Icon from '~ui/icon';
import { Input } from '~ui/input';
import { Label } from '~ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '~ui/sidebar';
import { Textarea } from '~ui/textarea';
import { Muted, Small } from '~ui/typography';

export default function SidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isTaskFocused, taskId, clearFocus } = useAction();
  const t = useTranslations();
  const showToast = useToast();
  const { tasks, updateTask, deleteTask } = useTaskStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState({
    title: '',
    description: '',
    status: TASK_STATUS.TODO as any,
    tags: [] as string[],
    dueDate: [] as string[],
    icon: '',
  });

  const task = React.useMemo(() => {
    return tasks.find((t) => t.id === taskId);
  }, [tasks, taskId]);

  React.useEffect(() => {
    if (task) {
      setEditData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        tags: task.tags || [],
        dueDate: task.dueDate || [],
        icon: task.icon || '',
      });
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;

    try {
      await updateTask(task.id, editData);
      setIsEditing(false);
      showToast({
        title: t('Task.taskUpdated'),
        variant: 'success',
      });
    } catch {
      showToast({
        title: t('Task.taskUpdateFailed'),
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    if (task) {
      setEditData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        tags: task.tags || [],
        dueDate: task.dueDate || [],
        icon: task.icon || '',
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!task) return;

    try {
      await deleteTask(task.id);
      clearFocus(); // Close sidebar after deleting
      showToast({
        title: t('Task.taskDeleted'),
        variant: 'success',
      });
    } catch {
      showToast({
        title: t('Task.taskDeleteFailed'),
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    clearFocus();
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    setEditData((prev) => ({
      ...prev,
      tags: checked ? [...prev.tags, tag] : prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleDueDateChange = (date: string, checked: boolean) => {
    setEditData((prev) => ({
      ...prev,
      dueDate: checked ? [...prev.dueDate, date] : prev.dueDate.filter((d) => d !== date),
    }));
  };

  if (!isTaskFocused || !task) return null;

  return (
    <Sidebar className="sticky top-0 hidden border-l h-svh lg:flex w-80" {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {task.icon && <Icon name={task.icon as any} className="w-5 h-5" />}
          <Small className="font-medium">{t('Task.taskTitle')}</Small>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} variant="ghost" aria-label="Save">
                <Save className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handleCancel} variant="ghost" aria-label="Cancel">
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
                variant="ghost"
                aria-label="Edit"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handleClose} variant="ghost" aria-label="Close">
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6">
        {/* Task Title */}
        <div className="space-y-2">
          <Label>{t('Task.taskTitle')}</Label>
          {isEditing ? (
            <Input
              value={editData.title}
              onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder={t('Task.taskTitle')}
            />
          ) : (
            <div className="p-3 bg-muted rounded-md">
              <Small className="font-medium">{task.title}</Small>
            </div>
          )}
        </div>

        {/* Task Description */}
        <div className="space-y-2">
          <Label>{t('Task.taskDescription')}</Label>
          {isEditing ? (
            <Textarea
              value={editData.description}
              onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder={t('Task.taskDescription')}
              rows={4}
            />
          ) : (
            <div className="p-3 bg-muted rounded-md min-h-[80px]">
              <Small>{task.description || t('Task.taskDescription')}</Small>
            </div>
          )}
        </div>

        {/* Task Status */}
        <div className="space-y-2">
          <Label>{t('Status.status')}</Label>
          {isEditing ? (
            <Select
              value={editData.status}
              onValueChange={(value) => setEditData((prev) => ({ ...prev, status: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TASK_STATUS.TODO}>{t('Status.todo')}</SelectItem>
                <SelectItem value={TASK_STATUS.IN_PROGRESS}>{t('Status.inProgress')}</SelectItem>
                <SelectItem value={TASK_STATUS.DONE}>{t('Status.done')}</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="p-3 bg-muted rounded-md">
              <Badge variant={task.status === TASK_STATUS.DONE ? 'secondary' : 'outline'}>
                {t(`Status.${task.status}`)}
              </Badge>
            </div>
          )}
        </div>

        {/* Task Icon */}
        <div className="space-y-2">
          <Label>{t('Project.icon')}</Label>
          {isEditing ? (
            <Select
              value={editData.icon || 'none'}
              onValueChange={(value) =>
                setEditData((prev) => ({ ...prev, icon: value === 'none' ? '' : value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('Project.icon')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('Common.cancel')}</SelectItem>
                <SelectItem value="calendar">📅 Calendar</SelectItem>
                <SelectItem value="clock">⏰ Clock</SelectItem>
                <SelectItem value="star">⭐ Star</SelectItem>
                <SelectItem value="check">✅ Check</SelectItem>
                <SelectItem value="flag">🚩 Flag</SelectItem>
                <SelectItem value="fire">🔥 Fire</SelectItem>
                <SelectItem value="rocket">🚀 Rocket</SelectItem>
                <SelectItem value="heart">❤️ Heart</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="p-3 bg-muted rounded-md">
              {task.icon ? (
                <Icon name={task.icon as any} className="w-6 h-6" />
              ) : (
                <Muted>{t('Project.icon')}</Muted>
              )}
            </div>
          )}
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t('Task.dueDate')}
          </Label>
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="today"
                  checked={editData.dueDate.includes('today')}
                  onCheckedChange={(checked) => handleDueDateChange('today', checked as boolean)}
                />
                <Label htmlFor="today">{t('Project.today')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tomorrow"
                  checked={editData.dueDate.includes('tomorrow')}
                  onCheckedChange={(checked) => handleDueDateChange('tomorrow', checked as boolean)}
                />
                <Label htmlFor="tomorrow">{t('Project.tomorrow')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="week"
                  checked={editData.dueDate.includes('week')}
                  onCheckedChange={(checked) => handleDueDateChange('week', checked as boolean)}
                />
                <Label htmlFor="week">{t('Project.thisWeek')}</Label>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-muted rounded-md">
              {task.dueDate && task.dueDate.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {task.dueDate.map((date) => (
                    <Badge key={date} variant="outline">
                      {['today', 'tomorrow', 'week'].includes(date) ? t(`Project.${date}`) : date}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Muted>{t('Task.noDueDate')}</Muted>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>{t('Task.tags')}</Label>
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="high-priority"
                  checked={editData.tags.includes('high')}
                  onCheckedChange={(checked) => handleTagChange('high', checked as boolean)}
                />
                <Label htmlFor="high-priority">{t('Priority.high')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medium-priority"
                  checked={editData.tags.includes('medium')}
                  onCheckedChange={(checked) => handleTagChange('medium', checked as boolean)}
                />
                <Label htmlFor="medium-priority">{t('Priority.medium')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="low-priority"
                  checked={editData.tags.includes('low')}
                  onCheckedChange={(checked) => handleTagChange('low', checked as boolean)}
                />
                <Label htmlFor="low-priority">{t('Priority.low')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent"
                  checked={editData.tags.includes('urgent')}
                  onCheckedChange={(checked) => handleTagChange('urgent', checked as boolean)}
                />
                <Label htmlFor="urgent">{t('Priority.urgent')}</Label>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-muted rounded-md">
              {task.tags && task.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {t(`Priority.${tag}`)}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Muted>{t('Task.noTags')}</Muted>
              )}
            </div>
          )}
        </div>

        {/* Task Info */}
        <SidebarSeparator />
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {t('Task.taskInfo')}
          </Label>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>
              {t('Task.createdAt')}: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
            </div>
            <div>
              {t('Task.modifiedAt')}: {format(new Date(task.modifiedAt), 'MMM dd, yyyy')}
            </div>
            {task.projectId && (
              <div>
                {t('Task.projectId')}: {task.projectId}
              </div>
            )}
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleDelete} className="text-destructive">
              {t('Task.delete')}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
