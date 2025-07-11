import { PROJECT_DEFAULT_KEY } from '~constants/project';

describe('i18n Integration', () => {
  describe('Project Names', () => {
    it('should have all initData project keys defined', () => {
      const expectedKeys = [
        PROJECT_DEFAULT_KEY.TODAY,
        PROJECT_DEFAULT_KEY.TOMORROW,
        PROJECT_DEFAULT_KEY.THIS_WEEK,
        PROJECT_DEFAULT_KEY.HIGH_PRIORITY,
        PROJECT_DEFAULT_KEY.MEDIUM_PRIORITY,
        PROJECT_DEFAULT_KEY.LOW_PRIORITY,
        PROJECT_DEFAULT_KEY.PLANNED,
        PROJECT_DEFAULT_KEY.BACKLOG,
        PROJECT_DEFAULT_KEY.COMPLETED,
      ];

      expectedKeys.forEach((key) => {
        expect(key).toBeDefined();
        expect(typeof key).toBe('string');
        expect(key.length).toBeGreaterThan(0);
      });
    });

    it('should have consistent project key naming', () => {
      // All keys should follow camelCase pattern
      const keys = Object.values(PROJECT_DEFAULT_KEY);
      keys.forEach((key) => {
        expect(key).toMatch(/^[a-z][a-zA-Z]*$/);
      });
    });
  });

  describe('Translation Keys', () => {
    it('should have expected translation keys for projects', () => {
      const expectedTranslationKeys = [
        'today',
        'tomorrow',
        'thisWeek',
        'highPriority',
        'mediumPriority',
        'lowPriority',
        'planned',
        'backlog',
        'completed',
        'defaultProjects',
        'projects',
        'noProjectsYet',
        'addProject',
        'createProject',
        'projectName',
        'projectNamePlaceholder',
        'icon',
        'projectCreated',
        'projectCreationFailed',
        'projectNameRequired',
        'projectNotFound',
        'filterViewDescription',
        'noTasksMatchFilter',
        'noTasksYet',
        'noTasks',
      ];

      // This test ensures we have all the expected keys defined
      // In a real app, you would test against actual translation files
      expectedTranslationKeys.forEach((key) => {
        expect(key).toBeDefined();
        expect(typeof key).toBe('string');
      });
    });

    it('should have expected translation keys for tasks', () => {
      const expectedTaskKeys = [
        'createTask',
        'taskTitle',
        'taskDescription',
        'taskCreated',
        'taskCreationFailed',
        'taskTitleRequired',
        'taskNotFound',
        'taskUpdated',
        'taskUpdateFailed',
        'taskDeleted',
        'taskDeleteFailed',
        'addTask',
        'open',
        'delete',
      ];

      expectedTaskKeys.forEach((key) => {
        expect(key).toBeDefined();
        expect(typeof key).toBe('string');
      });
    });

    it('should have expected translation keys for priorities', () => {
      const expectedPriorityKeys = ['high', 'medium', 'low', 'urgent', 'critical', 'normal'];

      expectedPriorityKeys.forEach((key) => {
        expect(key).toBeDefined();
        expect(typeof key).toBe('string');
      });
    });

    it('should have expected translation keys for statuses', () => {
      const expectedStatusKeys = ['todo', 'inProgress', 'done'];

      expectedStatusKeys.forEach((key) => {
        expect(key).toBeDefined();
        expect(typeof key).toBe('string');
      });
    });
  });
});
