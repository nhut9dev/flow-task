import { NextRequest, NextResponse } from 'next/server';

// Mock data for development (this should be shared with the main projects route)
const projects = [
  {
    id: '1',
    name: 'Default Project',
    icon: '📁',
    folderId: null,
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);

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
    const projectIndex = projects.findIndex((p) => p.id === params.id);

    if (projectIndex === -1) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: 'Project not found',
        },
        { status: 404 },
      );
    }

    const updatedProject = {
      ...projects[projectIndex],
      ...body,
      modifiedAt: new Date().toISOString(),
    };

    projects[projectIndex] = updatedProject;

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
  const projectIndex = projects.findIndex((p) => p.id === params.id);

  if (projectIndex === -1) {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Project not found',
      },
      { status: 404 },
    );
  }

  projects.splice(projectIndex, 1);

  return NextResponse.json({
    data: null,
    success: true,
    message: 'Project deleted successfully',
  });
}
