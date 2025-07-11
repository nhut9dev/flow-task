import { createFolderSchema, createProjectSchema, createTaskSchema } from '~lib/validation/schemas';

describe('Validation Schemas', () => {
  describe('createTaskSchema', () => {
    it('should validate a valid task', () => {
      const validTask = {
        title: 'Test Task',
        description: 'Test description',
        tags: ['urgent'],
        dueDate: [],
      };

      const result = createTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should reject task without title', () => {
      const invalidTask = {
        description: 'Test description',
        tags: [],
        dueDate: [],
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required');
      }
    });

    it('should reject task with title too long', () => {
      const invalidTask = {
        title: 'a'.repeat(101), // 101 characters
        tags: [],
        dueDate: [],
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title must be less than 100 characters');
      }
    });

    it('should reject task with description too long', () => {
      const invalidTask = {
        title: 'Test Task',
        description: 'a'.repeat(501), // 501 characters
        tags: [],
        dueDate: [],
      };

      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description must be less than 500 characters');
      }
    });
  });

  describe('createProjectSchema', () => {
    it('should validate a valid project', () => {
      const validProject = {
        name: 'Test Project',
        icon: 'folder',
      };

      const result = createProjectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    it('should reject project without name', () => {
      const invalidProject = {
        icon: 'folder',
      };

      const result = createProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required');
      }
    });

    it('should reject project with name too long', () => {
      const invalidProject = {
        name: 'a'.repeat(51), // 51 characters
      };

      const result = createProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name must be less than 50 characters');
      }
    });
  });

  describe('createFolderSchema', () => {
    it('should validate a valid folder', () => {
      const validFolder = {
        name: 'Test Folder',
        icon: 'folder',
      };

      const result = createFolderSchema.safeParse(validFolder);
      expect(result.success).toBe(true);
    });

    it('should reject folder without name', () => {
      const invalidFolder = {
        icon: 'folder',
      };

      const result = createFolderSchema.safeParse(invalidFolder);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required');
      }
    });
  });
});
