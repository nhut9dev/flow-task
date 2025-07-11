import { z } from 'zod';

// Task validation schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  icon: z.string().optional(),
  tags: z.array(z.string()).default([]),
  dueDate: z.array(z.string()).default([]),
  projectId: z.string().optional(),
  folderId: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.string().optional(),
});

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  icon: z.string().optional(),
  folderId: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  taskIds: z.array(z.string()).optional(),
});

// Folder validation schemas
export const createFolderSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  icon: z.string().optional(),
});

export const updateFolderSchema = createFolderSchema.partial().extend({
  projectIds: z.array(z.string()).optional(),
});

// Pomodoro settings validation schema
export const pomodoroSettingsSchema = z.object({
  workDuration: z.number().min(1).max(120),
  shortBreakDuration: z.number().min(1).max(30),
  longBreakDuration: z.number().min(1).max(60),
  longBreakInterval: z.number().min(1).max(10),
  autoStartPomodoro: z.boolean(),
  autoStartBreak: z.boolean(),
});

// Export types
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
export type PomodoroSettingsInput = z.infer<typeof pomodoroSettingsSchema>;
