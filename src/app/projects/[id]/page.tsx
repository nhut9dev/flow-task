'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { useProjectStore } from '~stores/projectStore';

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as string;
  const projects = useProjectStore((state) => state.projects);
  const t = useTranslations('Project');

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const projectName = project.name.startsWith('Project.')
    ? t(project.name.replace('Project.', ''))
    : project.name;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{projectName}</h1>
        <p className="text-muted-foreground">Project ID: {project.id}</p>
      </div>

      <div className="grid gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Project Details</h2>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {projectName}
            </p>
            <p>
              <strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Modified:</strong> {new Date(project.modifiedAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Tasks:</strong> {project.taskIds.length}
            </p>
            {project.folderId && (
              <p>
                <strong>Folder ID:</strong> {project.folderId}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
