import { NextRequest, NextResponse } from 'next/server';

// Mock settings data (in real app, this would be in a shared location)
const mockSettings = {
  theme: 'light',
  showCompletedTasks: true,
  favoriteIcons: ['📁', '📝', '✅'],
  recentIcons: ['📁', '📝', '✅', '🎯', '📅'],
};

export async function DELETE(request: NextRequest, { params }: { params: { iconName: string } }) {
  try {
    const iconName = decodeURIComponent(params.iconName);

    mockSettings.favoriteIcons = mockSettings.favoriteIcons.filter((icon) => icon !== iconName);

    return NextResponse.json({
      data: mockSettings,
      success: true,
      message: 'Favorite icon removed successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to remove favorite icon',
      },
      { status: 500 },
    );
  }
}
