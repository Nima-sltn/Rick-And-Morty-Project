import { render } from '@testing-library/react';
import Skeleton from '../components/Skeleton';
import { describe, it, expect } from 'vitest';

describe('Skeleton Component', () => {
  it('renders 5 skeleton items for type "list"', () => {
    const { container } = render(<Skeleton type="list" />);
    const items = container.querySelectorAll('.skeleton-item');
    expect(items.length).toBe(5);
  });

  it('renders skeleton elements for type "detail"', () => {
    const { container } = render(<Skeleton type="detail" />);
    expect(container.querySelector('.skeleton-img')).toBeTruthy();
    expect(container.querySelector('.skeleton-info')).toBeTruthy();
  });
});
