import { NextRequest, NextResponse } from 'next/server';

import { initDataService } from '~lib/api/initData';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const task = initDataService.getTaskById(params.id);

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
    const { title, description, status, projectId, tags, dueDate } = body;

    const updatedTask = initDataService.updateTask(params.id, {
      title,
      description,
      status,
      projectId,
      tags,
      dueDate,
    });

    if (!updatedTask) {
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
  const success = initDataService.deleteTask(params.id);

  if (!success) {
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
    data: null,
    success: true,
    message: 'Task deleted successfully',
  });
}
