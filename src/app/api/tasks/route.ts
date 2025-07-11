import { NextRequest, NextResponse } from 'next/server';

import { initDataService } from '~lib/api/initData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  let filteredTasks;
  if (projectId) {
    filteredTasks = initDataService.getTasksByProject(projectId);
  } else {
    filteredTasks = initDataService.getAllTasks();
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
    const { title, description, status, projectId, tags, dueDate } = body;

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

    const newTask = initDataService.createTask({
      title,
      description: description || '',
      status: status || 'todo',
      projectId: projectId || null,
      tags: tags || [],
      dueDate: dueDate || [],
    });

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
