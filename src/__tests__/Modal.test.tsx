import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../components/Modal';
import { describe, it, expect, vi } from 'vitest';

describe('Modal Component', () => {
  it('does not render when open is false', () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()} title="Test Modal">
        Test Content
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when open is true', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        Test Content
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Test Modal">
        Test Content
      </Modal>
    );
    const backdrop = document.querySelector('.backdrop');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Test Modal">
        Test Content
      </Modal>
    );
    const closeButton = screen.getByLabelText(/close modal/i);
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
