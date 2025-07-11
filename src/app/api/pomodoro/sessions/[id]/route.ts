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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

    // Find session in current or past sessions
    let session = mockPomodoroData.currentSession;
    let sessionIndex = -1;

    if (session && session.id === params.id) {
      // Update current session
      session = { ...session, ...body };
      mockPomodoroData.currentSession = session;
    } else {
      // Find in past sessions
      sessionIndex = mockPomodoroData.pastSessions.findIndex((s) => s.id === params.id);
      if (sessionIndex !== -1) {
        session = { ...mockPomodoroData.pastSessions[sessionIndex], ...body };
        mockPomodoroData.pastSessions[sessionIndex] = session;
      }
    }

    if (!session) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: 'Session not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: session,
      success: true,
      message: 'Session updated successfully',
    });
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to update session',
      },
      { status: 500 },
    );
  }
}
