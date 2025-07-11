import { NextRequest, NextResponse } from 'next/server';

import { initDataService } from '~lib/api/initData';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const projectTasks = initDataService.getTasksByProject(params.id);

  return NextResponse.json({
    data: projectTasks,
    success: true,
    message: 'Project tasks fetched successfully',
  });
}
