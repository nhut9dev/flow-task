import { fireEvent, render, screen } from '@testing-library/react';

import { ToastProvider, useToastContext } from '~components/ui/toast-provider';

// Test component để trigger toast
const TestComponent = () => {
  const { showToast } = useToastContext();

  return (
    <div>
      <button onClick={() => showToast({ title: 'Test Toast', description: 'Test Description' })}>
        Show Toast
      </button>
      <button onClick={() => showToast({ title: 'Success Toast', variant: 'success' })}>
        Show Success Toast
      </button>
      <button onClick={() => showToast({ title: 'Error Toast', variant: 'destructive' })}>
        Show Error Toast
      </button>
    </div>
  );
};

describe('ToastProvider', () => {
  it('renders children without crashing', () => {
    render(
      <ToastProvider>
        <div>Test Content</div>
      </ToastProvider>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows toast when showToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const showToastButton = screen.getByText('Show Toast');
    fireEvent.click(showToastButton);

    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('shows multiple toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const showToastButton = screen.getByText('Show Toast');
    const showSuccessButton = screen.getByText('Show Success Toast');

    fireEvent.click(showToastButton);
    fireEvent.click(showSuccessButton);

    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByText('Success Toast')).toBeInTheDocument();
  });

  it('removes toast when close button is clicked', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const showToastButton = screen.getByText('Show Toast');
    fireEvent.click(showToastButton);

    expect(screen.getByText('Test Toast')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
  });

  it('renders toasts with different variants', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const showSuccessButton = screen.getByText('Show Success Toast');
    const showErrorButton = screen.getByText('Show Error Toast');

    fireEvent.click(showSuccessButton);
    fireEvent.click(showErrorButton);

    expect(screen.getByText('Success Toast')).toBeInTheDocument();
    expect(screen.getByText('Error Toast')).toBeInTheDocument();
  });
});
