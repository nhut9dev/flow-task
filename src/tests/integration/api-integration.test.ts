import { describe, expect, it } from '@jest/globals';
import fetch from 'node-fetch';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

interface Project {
  id: string;
  name: string;
  icon: string;
  folderId: string | null;
  createdAt: string;
  modifiedAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  projectId: string;
  tags: string[];
  dueDate: string[];
  createdAt: string;
  modifiedAt: string;
}

interface Folder {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
  modifiedAt: string;
}

describe('API Integration Tests', () => {
  const baseUrl = 'http://localhost:3001/api';

  it('should create and fetch projects', async () => {
    // Create a project
    const createResponse = await fetch(`${baseUrl}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Project from Integration Test',
        icon: '🧪',
      }),
    });

    expect(createResponse.ok).toBe(true);
    const createData = (await createResponse.json()) as ApiResponse<Project>;
    expect(createData.success).toBe(true);
    expect(createData.data.name).toBe('Test Project from Integration Test');

    // Fetch projects
    const fetchResponse = await fetch(`${baseUrl}/projects`);
    expect(fetchResponse.ok).toBe(true);
    const fetchData = (await fetchResponse.json()) as ApiResponse<Project[]>;
    expect(fetchData.success).toBe(true);
    expect(Array.isArray(fetchData.data)).toBe(true);
  });

  it('should create and fetch tasks', async () => {
    // Create a task
    const createResponse = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Task from Integration Test',
        description: 'This is a test task',
        projectId: '1',
        tags: ['test'],
        dueDate: [],
      }),
    });

    expect(createResponse.ok).toBe(true);
    const createData = (await createResponse.json()) as ApiResponse<Task>;
    expect(createData.success).toBe(true);
    expect(createData.data.title).toBe('Test Task from Integration Test');

    // Fetch tasks
    const fetchResponse = await fetch(`${baseUrl}/tasks`);
    expect(fetchResponse.ok).toBe(true);
    const fetchData = (await fetchResponse.json()) as ApiResponse<Task[]>;
    expect(fetchData.success).toBe(true);
    expect(Array.isArray(fetchData.data)).toBe(true);
  });

  it('should create and fetch folders', async () => {
    // Create a folder
    const createResponse = await fetch(`${baseUrl}/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Folder from Integration Test',
        icon: '📁',
      }),
    });

    expect(createResponse.ok).toBe(true);
    const createData = (await createResponse.json()) as ApiResponse<Folder>;
    expect(createData.success).toBe(true);
    expect(createData.data.name).toBe('Test Folder from Integration Test');

    // Fetch folders
    const fetchResponse = await fetch(`${baseUrl}/folders`);
    expect(fetchResponse.ok).toBe(true);
    const fetchData = (await fetchResponse.json()) as ApiResponse<Folder[]>;
    expect(fetchData.success).toBe(true);
    expect(Array.isArray(fetchData.data)).toBe(true);
  });
});
