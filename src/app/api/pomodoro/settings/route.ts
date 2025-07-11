import { NextRequest, NextResponse } from 'next/server';

// Mock pomodoro data
const mockPomodoroData: {
  currentSession: any;
  pastSessions: any[];
  settings: any;
} = {
  currentSession: null,
  pastSessions: [],
  settings: {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  },
};

export async function GET() {
  return NextResponse.json({
    data: mockPomodoroData.settings,
    success: true,
    message: 'Pomodoro settings fetched successfully',
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Update settings
    mockPomodoroData.settings = {
      ...mockPomodoroData.settings,
      ...body,
    };

    return NextResponse.json({
      data: mockPomodoroData.settings,
      success: true,
      message: 'Pomodoro settings updated successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to update pomodoro settings',
      },
      { status: 500 },
    );
  }
}
