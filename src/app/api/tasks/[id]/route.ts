import { NextRequest, NextResponse } from 'next/server';

// Mock data for development (this should be shared with the main tasks route)
const tasks = [
  {
    id: '1',
    title: 'Sample Task',
    description: 'This is a sample task',
    status: 'todo',
    projectId: '1',
    tags: ['sample'],
    dueDate: [],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const task = tasks.find((t) => t.id === params.id);

  if (!task) {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Task not found',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data: task,
    success: true,
    message: 'Task fetched successfully',
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const taskIndex = tasks.findIndex((t) => t.id === params.id);

    if (taskIndex === -1) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: 'Task not found',
        },
        { status: 404 },
      );
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...body,
      modifiedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;

    return NextResponse.json({
      data: updatedTask,
      success: true,
      message: 'Task updated successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to update task',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const taskIndex = tasks.findIndex((t) => t.id === params.id);

  if (taskIndex === -1) {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Task not found',
      },
      { status: 404 },
    );
  }

  tasks.splice(taskIndex, 1);

  return NextResponse.json({
    data: null,
    success: true,
    message: 'Task deleted successfully',
  });
}
