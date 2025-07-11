import { NextRequest, NextResponse } from 'next/server';

// Mock settings data (in real app, this would be in a shared location)
const mockSettings = {
  theme: 'light',
  showCompletedTasks: true,
  favoriteIcons: ['📁', '📝', '✅'],
  recentIcons: ['📁', '📝', '✅', '🎯', '📅'],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { iconName } = body;

    if (!iconName) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: 'Icon name is required',
        },
        { status: 400 },
      );
    }

    if (!mockSettings.favoriteIcons.includes(iconName)) {
      mockSettings.favoriteIcons.push(iconName);
    }

    return NextResponse.json({
      data: mockSettings,
      success: true,
      message: 'Favorite icon added successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to add favorite icon',
      },
      { status: 500 },
    );
  }
}
