import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
const tasks = [
  {
    id: '1',
    title: 'Sample Task',
    description: 'This is a sample task',
    status: 'todo',
    projectId: '1',
    folderId: '1',
    tags: ['sample'],
    dueDate: [],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const folderTasks = tasks.filter((t) => t.folderId === params.id);

  return NextResponse.json({
    data: folderTasks,
    success: true,
    message: 'Folder tasks fetched successfully',
  });
}
