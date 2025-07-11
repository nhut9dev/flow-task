import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
const projects = [
  {
    id: '1',
    name: 'Default Project',
    icon: '📁',
    folderId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const folderProjects = projects.filter((p) => p.folderId === params.id);

  return NextResponse.json({
    data: folderProjects,
    success: true,
    message: 'Folder projects fetched successfully',
  });
}
