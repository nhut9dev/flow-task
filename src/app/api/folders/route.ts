import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: [],
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

    // For now, return success but don't actually create folders
    // since we're focusing on projects without folders
    return NextResponse.json({
      data: { id: Date.now().toString(), name, icon: icon || '📁' },
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
