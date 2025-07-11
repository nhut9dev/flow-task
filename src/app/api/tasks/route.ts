import { NextRequest, NextResponse } from 'next/server';

import { mockTasks } from '~lib/api/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  let filteredTasks = mockTasks;
  if (projectId) {
    filteredTasks = mockTasks.filter((task) => task.projectId === projectId);
  }

  return NextResponse.json({
    data: filteredTasks,
    success: true,
    message: 'Tasks fetched successfully',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, projectId, tags, dueDate } = body;

    if (!title) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: 'Task title is required',
        },
        { status: 400 },
      );
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      description: description || '',
      status: 'todo',
      projectId: projectId || null,
      tags: tags || [],
      dueDate: dueDate || [],
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };

    mockTasks.push(newTask);

    return NextResponse.json({
      data: newTask,
      success: true,
      message: 'Task created successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to create task',
      },
      { status: 500 },
    );
  }
}
