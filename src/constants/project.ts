import dayjs from 'dayjs';

export const PROJECT_DEFAULT_KEY = {
  TODAY: 'today',
  TOMORROW: 'tomorrow',
  THIS_WEEK: 'thisWeek',
  HIGH_PROPERTY: 'highProperty',
  MEDIUM_PROPERTY: 'mediumProperty',
  LOW_PROPERTY: 'lowProperty',
  PLANNED: 'planned',
};

export const PROJECT_DEFAULT_DATA = [
  {
    id: PROJECT_DEFAULT_KEY.TODAY,
    name: `Project.${PROJECT_DEFAULT_KEY.TODAY}`,
    taskIds: [],
    disabled: true,
    createdAt: dayjs().toISOString(),
    modifiedAt: dayjs().toISOString(),
  },
  {
    id: PROJECT_DEFAULT_KEY.TOMORROW,
    name: `Project.${PROJECT_DEFAULT_KEY.TOMORROW}`,
    taskIds: [],
    disabled: true,
    createdAt: dayjs().toISOString(),
    modifiedAt: dayjs().toISOString(),
  },
  {
    id: PROJECT_DEFAULT_KEY.THIS_WEEK,
    name: `Project.${PROJECT_DEFAULT_KEY.THIS_WEEK}`,
    taskIds: [],
    disabled: true,
    createdAt: dayjs().toISOString(),
    modifiedAt: dayjs().toISOString(),
  },
  {
    id: PROJECT_DEFAULT_KEY.HIGH_PROPERTY,
    name: `Project.${PROJECT_DEFAULT_KEY.HIGH_PROPERTY}`,
    taskIds: [],
    disabled: true,
    createdAt: dayjs().toISOString(),
    modifiedAt: dayjs().toISOString(),
  },
  {
    id: PROJECT_DEFAULT_KEY.MEDIUM_PROPERTY,
    name: `Project.${PROJECT_DEFAULT_KEY.MEDIUM_PROPERTY}`,
    taskIds: [],
    disabled: true,
    createdAt: dayjs().toISOString(),
    modifiedAt: dayjs().toISOString(),
  },
  {
    id: PROJECT_DEFAULT_KEY.LOW_PROPERTY,
    name: `Project.${PROJECT_DEFAULT_KEY.LOW_PROPERTY}`,
    taskIds: [],
    disabled: true,
    createdAt: dayjs().toISOString(),
    modifiedAt: dayjs().toISOString(),
  },
  {
    id: PROJECT_DEFAULT_KEY.PLANNED,
    name: `Project.${PROJECT_DEFAULT_KEY.PLANNED}`,
    taskIds: [],
    disabled: true,
    createdAt: dayjs().toISOString(),
    modifiedAt: dayjs().toISOString(),
  },
];
