import { NextRequest, NextResponse } from 'next/server';

// Mock data for development (this should be shared with the main folders route)
const folders = [
  {
    id: '1',
    name: 'Default Folder',
    icon: '📁',
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const folder = folders.find((f) => f.id === params.id);

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
    const folderIndex = folders.findIndex((f) => f.id === params.id);

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
      ...folders[folderIndex],
      ...body,
      modifiedAt: new Date().toISOString(),
    };

    folders[folderIndex] = updatedFolder;

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
  const folderIndex = folders.findIndex((f) => f.id === params.id);

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

  folders.splice(folderIndex, 1);

  return NextResponse.json({
    data: null,
    success: true,
    message: 'Folder deleted successfully',
  });
}
