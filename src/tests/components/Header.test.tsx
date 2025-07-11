import { render, screen } from '@testing-library/react';

import Header from '~app/_components/SidebarLeft/header';

// Mock the hooks
jest.mock('~hooks/useInitStore', () => ({
  useInitStore: jest.fn(),
}));

// Mock the UI components with simple implementations
jest.mock('~ui/sidebar', () => ({
  useSidebar: () => ({ isMobile: false }),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu">{children}</div>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu-item">{children}</div>
  ),
  SidebarMenuButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="sidebar-menu-button">{children}</button>
  ),
}));

jest.mock('~ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-label">{children}</div>
  ),
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-item">{children}</div>
  ),
  DropdownMenuSeparator: () => <div data-testid="dropdown-separator">separator</div>,
  DropdownMenuShortcut: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="dropdown-shortcut">{children}</span>
  ),
}));

jest.mock('~ui/icon', () => ({
  default: ({ name }: { name: string }) => <span data-testid="icon">icon-{name}</span>,
}));

jest.mock('~app/_components/SidebarLeft/create-folder-form', () => ({
  CreateFolderForm: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="create-folder-form">{children}</div>
  ),
}));

describe('Header Component', () => {
  const mockSetSelectedFolderId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with undefined folders without crashing', () => {
    expect(() => {
      render(
        <Header
          folders={undefined as any}
          selectedFolderId={null}
          setSelectedFolderId={mockSetSelectedFolderId}
        />,
      );
    }).not.toThrow();
  });

  it('renders with null folders without crashing', () => {
    expect(() => {
      render(
        <Header
          folders={null as any}
          selectedFolderId={null}
          setSelectedFolderId={mockSetSelectedFolderId}
        />,
      );
    }).not.toThrow();
  });

  it('renders with empty folders array', () => {
    render(
      <Header folders={[]} selectedFolderId={null} setSelectedFolderId={mockSetSelectedFolderId} />,
    );

    expect(screen.getByText('All folders')).toBeInTheDocument();
    expect(screen.getByText('All projects')).toBeInTheDocument();
  });

  it('renders with folders that have undefined projectIds', () => {
    const folders = [
      {
        id: '1',
        name: 'Test Folder',
        projectIds: undefined,
        createdAt: '2023-01-01',
        modifiedAt: '2023-01-01',
      },
    ];

    expect(() => {
      render(
        <Header
          folders={folders as any}
          selectedFolderId={null}
          setSelectedFolderId={mockSetSelectedFolderId}
        />,
      );
    }).not.toThrow();
  });

  it('renders with folders that have null projectIds', () => {
    const folders = [
      {
        id: '1',
        name: 'Test Folder',
        projectIds: null,
        createdAt: '2023-01-01',
        modifiedAt: '2023-01-01',
      },
    ];

    expect(() => {
      render(
        <Header
          folders={folders as any}
          selectedFolderId={null}
          setSelectedFolderId={mockSetSelectedFolderId}
        />,
      );
    }).not.toThrow();
  });

  it('renders with valid folders data', () => {
    const folders = [
      {
        id: '1',
        name: 'Test Folder',
        projectIds: ['1', '2'],
        createdAt: '2023-01-01',
        modifiedAt: '2023-01-01',
      },
    ];

    render(
      <Header
        folders={folders}
        selectedFolderId={null}
        setSelectedFolderId={mockSetSelectedFolderId}
      />,
    );

    expect(screen.getByText('Test Folder')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // projectIds length
  });
});
