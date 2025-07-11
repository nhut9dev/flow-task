import { NextRequest, NextResponse } from 'next/server';

import { mockFolders } from '~lib/api/mockData';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const folder = mockFolders.find((f) => f.id === params.id);

  if (!folder) {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Folder not found',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data: folder,
    success: true,
    message: 'Folder fetched successfully',
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const folderIndex = mockFolders.findIndex((f) => f.id === params.id);

    if (folderIndex === -1) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: 'Folder not found',
        },
        { status: 404 },
      );
    }

    const updatedFolder = {
      ...mockFolders[folderIndex],
      ...body,
      modifiedAt: new Date().toISOString(),
    };

    mockFolders[folderIndex] = updatedFolder;

    return NextResponse.json({
      data: updatedFolder,
      success: true,
      message: 'Folder updated successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to update folder',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const folderIndex = mockFolders.findIndex((f) => f.id === params.id);

  if (folderIndex === -1) {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Folder not found',
      },
      { status: 404 },
    );
  }

  const folder = mockFolders[folderIndex];

  // Check if folder has projects
  if (folder.projectIds.length > 0) {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Cannot delete folder with projects. Please move or delete projects first.',
      },
      { status: 400 },
    );
  }

  // Remove folder from array
  mockFolders.splice(folderIndex, 1);

  return NextResponse.json({
    data: null,
    success: true,
    message: 'Folder deleted successfully',
  });
}
