import { NextRequest, NextResponse } from 'next/server';

import { mockTasks } from '~lib/api/mockData';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const projectTasks = mockTasks.filter((t) => t.projectId === params.id);

  return NextResponse.json({
    data: projectTasks,
    success: true,
    message: 'Project tasks fetched successfully',
  });
}
