import { NextRequest, NextResponse } from 'next/server';

import { mockFolders } from '~lib/api/mockData';

export async function GET() {
  return NextResponse.json({
    data: mockFolders,
    success: true,
    message: 'Folders fetched successfully',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon } = body;

    if (!name) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: 'Folder name is required',
        },
        { status: 400 },
      );
    }

    const newFolder = {
      id: Date.now().toString(),
      name,
      icon: icon || '📁',
      projectIds: [],
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };

    mockFolders.push(newFolder);

    return NextResponse.json({
      data: newFolder,
      success: true,
      message: 'Folder created successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to create folder',
      },
      { status: 500 },
    );
  }
}
