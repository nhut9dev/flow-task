import dayjs from 'dayjs';

import { PROJECT_DEFAULT_KEY } from '~constants/project';
import { initDataService } from '~lib/api/initData';

describe('initDataService', () => {
  beforeEach(() => {
    // Reset data before each test
    initDataService.resetData();
  });

  describe('Project Management', () => {
    it('should return all projects', () => {
      const projects = initDataService.getAllProjects();
      expect(projects).toHaveLength(9); // 9 default projects
      expect(projects.every((p) => p.disabled)).toBe(true);
    });

    it('should return projects by folder', () => {
      const projectsWithNoFolder = initDataService.getProjectsByFolder(null);
      expect(projectsWithNoFolder).toHaveLength(9); // All default projects have no folder

      const projectsWithFolder = initDataService.getProjectsByFolder('some-folder');
      expect(projectsWithFolder).toHaveLength(0); // No projects with folder initially
    });

    it('should get project by id', () => {
      const project = initDataService.getProjectById(PROJECT_DEFAULT_KEY.TODAY);
      expect(project).toBeDefined();
      expect(project?.id).toBe(PROJECT_DEFAULT_KEY.TODAY);
      expect(project?.disabled).toBe(true);
    });

    it('should create new project', () => {
      const newProject = initDataService.createProject({
        name: 'Test Project',
        icon: '🚀',
        folderId: null,
        disabled: false,
        taskIds: [],
        dueDate: [],
      });

      expect(newProject.id).toBeDefined();
      expect(newProject.name).toBe('Test Project');
      expect(newProject.disabled).toBe(false);

      const allProjects = initDataService.getAllProjects();
      expect(allProjects).toHaveLength(10); // 9 default + 1 new
    });

    it('should update project', () => {
      const updatedProject = initDataService.updateProject(PROJECT_DEFAULT_KEY.TODAY, {
        name: 'Updated Today',
      });

      expect(updatedProject).toBeDefined();
      expect(updatedProject?.name).toBe('Updated Today');
    });

    it('should not delete initData projects', () => {
      const result = initDataService.deleteProject(PROJECT_DEFAULT_KEY.TODAY);
      expect(result).toBe(false);

      const projects = initDataService.getAllProjects();
      expect(projects).toHaveLength(9); // Still 9 projects
    });

    it('should delete regular projects', () => {
      const newProject = initDataService.createProject({
        name: 'Test Project',
        icon: '🚀',
        folderId: null,
        disabled: false,
        taskIds: [],
        dueDate: [],
      });

      const result = initDataService.deleteProject(newProject.id);
      expect(result).toBe(true);

      const projects = initDataService.getAllProjects();
      expect(projects).toHaveLength(9); // Back to 9 projects
    });
  });

  describe('Task Management', () => {
    it('should return all tasks', () => {
      const tasks = initDataService.getAllTasks();
      expect(tasks.length).toBeGreaterThan(0);
    });

    it('should create task with default values for regular projects', () => {
      const newProject = initDataService.createProject({
        name: 'Test Project',
        icon: '🚀',
        folderId: null,
        disabled: false,
        taskIds: [],
        dueDate: [],
      });

      const newTask = initDataService.createTask({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        projectId: newProject.id,
        tags: [],
        dueDate: [],
      });

      expect(newTask.title).toBe('Test Task');
      expect(newTask.projectId).toBe(newProject.id);
      expect(newTask.tags).toEqual([]);
      expect(newTask.dueDate).toEqual([]);
    });

    it('should auto-assign dueDate for TODAY project', () => {
      const newTask = initDataService.createTask({
        title: 'Today Task',
        description: 'Task for today',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.TODAY,
        tags: [],
        dueDate: [],
      });

      expect(newTask.title).toBe('Today Task');
      expect(newTask.projectId).toBe(PROJECT_DEFAULT_KEY.TODAY);
      expect(newTask.dueDate).toEqual([dayjs().format('YYYY-MM-DD')]);
      expect(newTask.tags).toEqual([]);
    });

    it('should auto-assign dueDate for TOMORROW project', () => {
      const newTask = initDataService.createTask({
        title: 'Tomorrow Task',
        description: 'Task for tomorrow',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.TOMORROW,
        tags: [],
        dueDate: [],
      });

      expect(newTask.title).toBe('Tomorrow Task');
      expect(newTask.projectId).toBe(PROJECT_DEFAULT_KEY.TOMORROW);
      expect(newTask.dueDate).toEqual([dayjs().add(1, 'day').format('YYYY-MM-DD')]);
      expect(newTask.tags).toEqual([]);
    });

    it('should auto-assign dueDate for THIS_WEEK project', () => {
      const newTask = initDataService.createTask({
        title: 'Week Task',
        description: 'Task for this week',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.THIS_WEEK,
        tags: [],
        dueDate: [],
      });

      expect(newTask.title).toBe('Week Task');
      expect(newTask.projectId).toBe(PROJECT_DEFAULT_KEY.THIS_WEEK);
      expect(newTask.dueDate).toEqual([dayjs().endOf('week').format('YYYY-MM-DD')]);
      expect(newTask.tags).toEqual([]);
    });

    it('should auto-assign dueDate for PLANNED project', () => {
      const newTask = initDataService.createTask({
        title: 'Planned Task',
        description: 'Planned task',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.PLANNED,
        tags: [],
        dueDate: [],
      });

      expect(newTask.title).toBe('Planned Task');
      expect(newTask.projectId).toBe(PROJECT_DEFAULT_KEY.PLANNED);
      expect(newTask.dueDate).toEqual([dayjs().add(1, 'week').endOf('week').format('YYYY-MM-DD')]);
      expect(newTask.tags).toEqual([]);
    });

    it('should auto-assign tags for HIGH_PRIORITY project', () => {
      const newTask = initDataService.createTask({
        title: 'High Priority Task',
        description: 'High priority task',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.HIGH_PRIORITY,
        tags: [],
        dueDate: [],
      });

      expect(newTask.title).toBe('High Priority Task');
      expect(newTask.projectId).toBe(PROJECT_DEFAULT_KEY.HIGH_PRIORITY);
      expect(newTask.tags).toEqual(['high-priority']);
      expect(newTask.dueDate).toEqual([]);
    });

    it('should auto-assign tags for MEDIUM_PRIORITY project', () => {
      const newTask = initDataService.createTask({
        title: 'Medium Priority Task',
        description: 'Medium priority task',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.MEDIUM_PRIORITY,
        tags: [],
        dueDate: [],
      });

      expect(newTask.title).toBe('Medium Priority Task');
      expect(newTask.projectId).toBe(PROJECT_DEFAULT_KEY.MEDIUM_PRIORITY);
      expect(newTask.tags).toEqual(['medium-priority']);
      expect(newTask.dueDate).toEqual([]);
    });

    it('should auto-assign tags for LOW_PRIORITY project', () => {
      const newTask = initDataService.createTask({
        title: 'Low Priority Task',
        description: 'Low priority task',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.LOW_PRIORITY,
        tags: [],
        dueDate: [],
      });

      expect(newTask.title).toBe('Low Priority Task');
      expect(newTask.projectId).toBe(PROJECT_DEFAULT_KEY.LOW_PRIORITY);
      expect(newTask.tags).toEqual(['low-priority']);
      expect(newTask.dueDate).toEqual([]);
    });

    it('should not auto-assign for BACKLOG project', () => {
      const newTask = initDataService.createTask({
        title: 'Backlog Task',
        description: 'Backlog task',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.BACKLOG,
        tags: [],
        dueDate: [],
      });

      expect(newTask.title).toBe('Backlog Task');
      expect(newTask.projectId).toBe(PROJECT_DEFAULT_KEY.BACKLOG);
      expect(newTask.tags).toEqual([]);
      expect(newTask.dueDate).toEqual([]);
    });

    it('should not auto-assign for COMPLETED project', () => {
      const newTask = initDataService.createTask({
        title: 'Completed Task',
        description: 'Completed task',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.COMPLETED,
        tags: [],
        dueDate: [],
      });

      expect(newTask.title).toBe('Completed Task');
      expect(newTask.projectId).toBe(PROJECT_DEFAULT_KEY.COMPLETED);
      expect(newTask.tags).toEqual([]);
      expect(newTask.dueDate).toEqual([]);
    });

    it('should preserve existing dueDate and tags if provided', () => {
      const newTask = initDataService.createTask({
        title: 'Custom Task',
        description: 'Task with custom values',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.TODAY,
        tags: ['custom-tag'],
        dueDate: ['2024-12-31'],
      });

      expect(newTask.title).toBe('Custom Task');
      expect(newTask.projectId).toBe(PROJECT_DEFAULT_KEY.TODAY);
      expect(newTask.tags).toEqual(['custom-tag']); // Preserved
      expect(newTask.dueDate).toEqual(['2024-12-31']); // Preserved
    });

    it('should get tasks by project for regular projects', () => {
      const newProject = initDataService.createProject({
        name: 'Test Project',
        icon: '🚀',
        folderId: null,
        disabled: false,
        taskIds: [],
        dueDate: [],
      });

      const newTask = initDataService.createTask({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        projectId: newProject.id,
        tags: [],
        dueDate: [],
      });

      const projectTasks = initDataService.getTasksByProject(newProject.id);
      expect(projectTasks).toHaveLength(1);
      expect(projectTasks[0].id).toBe(newTask.id);
    });

    it('should filter tasks for initData projects', () => {
      // Clear existing tasks first to avoid conflicts with sample data
      initDataService.resetData();

      // Create tasks with different due dates
      const todayTask = initDataService.createTask({
        title: 'Today Task',
        description: 'Task for today',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.TODAY,
        tags: [],
        dueDate: [dayjs().format('YYYY-MM-DD')],
      });

      const tomorrowTask = initDataService.createTask({
        title: 'Tomorrow Task',
        description: 'Task for tomorrow',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.TOMORROW,
        tags: [],
        dueDate: [dayjs().add(1, 'day').format('YYYY-MM-DD')],
      });

      const highPriorityTask = initDataService.createTask({
        title: 'High Priority Task',
        description: 'High priority task',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.HIGH_PRIORITY,
        tags: ['high-priority'],
        dueDate: [],
      });

      // Test filtering
      const todayTasks = initDataService.getTasksByProject(PROJECT_DEFAULT_KEY.TODAY);
      expect(todayTasks).toHaveLength(1);
      expect(todayTasks[0].id).toBe(todayTask.id);

      const tomorrowTasks = initDataService.getTasksByProject(PROJECT_DEFAULT_KEY.TOMORROW);
      expect(tomorrowTasks).toHaveLength(1);
      expect(tomorrowTasks[0].id).toBe(tomorrowTask.id);

      const highPriorityTasks = initDataService.getTasksByProject(
        PROJECT_DEFAULT_KEY.HIGH_PRIORITY,
      );
      expect(highPriorityTasks).toHaveLength(1);
      expect(highPriorityTasks[0].id).toBe(highPriorityTask.id);
    });

    it('should update task', () => {
      const newTask = initDataService.createTask({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.TODAY,
        tags: [],
        dueDate: [],
      });

      const updatedTask = initDataService.updateTask(newTask.id, {
        title: 'Updated Task',
        status: 'done',
      });

      expect(updatedTask).toBeDefined();
      expect(updatedTask?.title).toBe('Updated Task');
      expect(updatedTask?.status).toBe('done');
    });

    it('should delete task', () => {
      const newTask = initDataService.createTask({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        projectId: PROJECT_DEFAULT_KEY.TODAY,
        tags: [],
        dueDate: [],
      });

      const result = initDataService.deleteTask(newTask.id);
      expect(result).toBe(true);

      const tasks = initDataService.getAllTasks();
      expect(tasks.find((t) => t.id === newTask.id)).toBeUndefined();
    });
  });
});
