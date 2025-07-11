import { NextRequest, NextResponse } from 'next/server';

import { initDataService } from '~lib/api/initData';

export async function GET() {
  const projects = initDataService.getAllProjects();

  return NextResponse.json({
    data: projects,
    success: true,
    message: 'Projects fetched successfully',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon, folderId } = body;

    if (!name) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: 'Project name is required',
        },
        { status: 400 },
      );
    }

    const newProject = initDataService.createProject({
      name,
      icon: icon || '📁',
      folderId: folderId || null,
      taskIds: [],
      dueDate: [],
      disabled: false,
    });

    return NextResponse.json({
      data: newProject,
      success: true,
      message: 'Project created successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to create project',
      },
      { status: 500 },
    );
  }
}
