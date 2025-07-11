import { NextRequest, NextResponse } from 'next/server';

// Mock settings data (in real app, this would be in a shared location)
const mockSettings = {
  theme: 'light',
  showCompletedTasks: true,
  favoriteIcons: ['📁', '📝', '✅'],
  recentIcons: ['📁', '📝', '✅', '🎯', '📅'],
};

const MAX_RECENT_ICONS = 18;

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

    // Remove icon if it already exists
    const filtered = mockSettings.recentIcons.filter((name) => name !== iconName);
    // Add to beginning and limit to MAX_RECENT_ICONS
    mockSettings.recentIcons = [iconName, ...filtered].slice(0, MAX_RECENT_ICONS);

    return NextResponse.json({
      data: mockSettings,
      success: true,
      message: 'Recent icon added successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to add recent icon',
      },
      { status: 500 },
    );
  }
}
