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
    // Find and complete current session
    if (mockPomodoroData.currentSession && mockPomodoroData.currentSession.id === params.id) {
      const completedSession = {
        ...mockPomodoroData.currentSession,
        completed: true,
        endTime: new Date().toISOString(),
      };

      // Move to past sessions
      mockPomodoroData.pastSessions.push(completedSession);
      mockPomodoroData.currentSession = null;

      return NextResponse.json({
        data: completedSession,
        success: true,
        message: 'Session completed successfully',
      });
    }

    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Session not found or not current',
      },
      { status: 404 },
    );
  } catch {
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: 'Failed to complete session',
      },
      { status: 500 },
    );
  }
}
