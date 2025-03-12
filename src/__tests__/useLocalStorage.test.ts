import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import useLocalStorage from '../hooks/useLocalStorage';

describe('useLocalStorage hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with the default value if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('initializes with the value from localStorage when present', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('updates localStorage when the value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    const [, setValue] = result.current;
    act(() => {
      setValue('updated');
    });
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });
});
