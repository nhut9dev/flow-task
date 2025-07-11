import { NextResponse } from 'next/server';

// Mock pomodoro data
const mockPomodoroData = {
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
    data: mockPomodoroData.currentSession,
    success: true,
    message: 'Current session fetched successfully',
  });
}
