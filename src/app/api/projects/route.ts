import { NextRequest, NextResponse } from 'next/server';

import { mockProjects } from '~lib/api/mockData';

export async function GET() {
  return NextResponse.json({
    data: mockProjects,
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

    const newProject = {
      id: Date.now().toString(),
      name,
      icon: icon || '📁',
      folderId: folderId || null,
      taskIds: [],
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };

    mockProjects.push(newProject);

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
