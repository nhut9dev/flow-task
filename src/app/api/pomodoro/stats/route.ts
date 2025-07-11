import { NextResponse } from 'next/server';

// Mock pomodoro data
const mockPomodoroData: {
  currentSession: any;
  pastSessions: any[];
  settings: any;
} = {
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
    {
      id: '2',
      taskId: '1',
      projectId: '1',
      type: 'break',
      duration: 5,
      actualDuration: 5,
      completed: true,
      interrupted: false,
      startTime: '2024-01-01T10:25:00Z',
      endTime: '2024-01-01T10:30:00Z',
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
  // TODO: Implement period filtering based on searchParams

  // Calculate stats from past sessions
  const workSessions = mockPomodoroData.pastSessions.filter((s) => s.type === 'work');
  const breakSessions = mockPomodoroData.pastSessions.filter((s) => s.type === 'break');

  const totalSessions = mockPomodoroData.pastSessions.length;
  const totalWorkTime = workSessions.reduce((sum, s) => sum + s.actualDuration, 0);
  const totalBreakTime = breakSessions.reduce((sum, s) => sum + s.actualDuration, 0);
  const completedSessions = mockPomodoroData.pastSessions.filter((s) => s.completed).length;
  const interruptedSessions = mockPomodoroData.pastSessions.filter((s) => s.interrupted).length;

  const stats = {
    totalSessions,
    totalWorkTime,
    totalBreakTime,
    completedSessions,
    interruptedSessions,
  };

  return NextResponse.json({
    data: stats,
    success: true,
    message: 'Pomodoro stats fetched successfully',
  });
}
