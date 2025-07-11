import { NextRequest, NextResponse } from 'next/server';

import { initDataService } from '~lib/api/initData';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const project = initDataService.getProjectById(params.id);

  if (!project) {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Project not found',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data: project,
    success: true,
    message: 'Project fetched successfully',
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, icon, folderId, taskIds, dueDate } = body;

    const updatedProject = initDataService.updateProject(params.id, {
      name,
      icon,
      folderId,
      taskIds,
      dueDate,
    });

    if (!updatedProject) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: 'Project not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: updatedProject,
      success: true,
      message: 'Project updated successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to update project',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const success = initDataService.deleteProject(params.id);

  if (!success) {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Project not found or cannot be deleted',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data: null,
    success: true,
    message: 'Project deleted successfully',
  });
}
