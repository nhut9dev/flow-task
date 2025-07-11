import { fireEvent, render, screen } from '@testing-library/react';

import { Toast } from '~components/ui/toast';

describe('Toast', () => {
  const defaultProps = {
    title: 'Test Toast',
    description: 'This is a test description',
    onClose: jest.fn(),
  };

  it('renders with title and description', () => {
    render(<Toast {...defaultProps} />);

    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('renders without description', () => {
    render(<Toast title="Test Toast" onClose={jest.fn()} />);

    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.queryByText('This is a test description')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Toast {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders with different variants', () => {
    const variants = ['default', 'success', 'destructive'] as const;

    variants.forEach((variant) => {
      const { container } = render(<Toast {...defaultProps} variant={variant} />);

      expect(container.firstChild).toHaveClass('group');
    });
  });

  it('renders with action', () => {
    const action = <button>Action Button</button>;
    render(<Toast {...defaultProps} action={action} />);

    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Toast {...defaultProps} className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
