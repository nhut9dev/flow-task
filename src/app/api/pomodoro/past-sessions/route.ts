import { NextResponse } from 'next/server';

// Mock pomodoro data
const mockPomodoroData = {
  currentSession: null,
  pastSessions: [
    {
      id: '1',
      taskId: '1',
      projectId: '1',
      type: 'work',
      duration: 25,
      actualDuration: 25,
      completed: true,
      interrupted: false,
      startTime: '2024-01-01T10:00:00Z',
      endTime: '2024-01-01T10:25:00Z',
    },
  ],
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
    data: mockPomodoroData.pastSessions,
    success: true,
    message: 'Past sessions fetched successfully',
  });
}
