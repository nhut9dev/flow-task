import { NextRequest, NextResponse } from 'next/server';

// Mock settings data
const mockSettings = {
  theme: 'light',
  showCompletedTasks: true,
  favoriteIcons: ['📁', '📝', '✅'],
  recentIcons: ['📁', '📝', '✅', '🎯', '📅'],
};

export async function GET() {
  return NextResponse.json({
    data: mockSettings,
    success: true,
    message: 'Settings fetched successfully',
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme, showCompletedTasks, favoriteIcons, recentIcons } = body;

    // Update mock settings
    if (theme !== undefined) mockSettings.theme = theme;
    if (showCompletedTasks !== undefined) mockSettings.showCompletedTasks = showCompletedTasks;
    if (favoriteIcons !== undefined) mockSettings.favoriteIcons = favoriteIcons;
    if (recentIcons !== undefined) mockSettings.recentIcons = recentIcons;

    return NextResponse.json({
      data: mockSettings,
      success: true,
      message: 'Settings updated successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to update settings',
      },
      { status: 500 },
    );
  }
}
