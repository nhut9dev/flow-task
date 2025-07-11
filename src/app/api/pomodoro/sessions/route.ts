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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, projectId, duration, type } = body;

    if (!duration || !type) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: 'Duration and type are required',
        },
        { status: 400 },
      );
    }

    const newSession = {
      id: Date.now().toString(),
      taskId,
      projectId,
      type,
      duration,
      actualDuration: 0,
      completed: false,
      interrupted: false,
      startTime: new Date().toISOString(),
      endTime: null,
    };

    mockPomodoroData.currentSession = newSession;

    return NextResponse.json({
      data: newSession,
      success: true,
      message: 'Session created successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to create session',
      },
      { status: 500 },
    );
  }
}
