import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, ThemeContext } from '../context/ThemeContext';
import { describe, it, expect } from 'vitest';

describe('ThemeProvider', () => {
  it('provides default theme and toggleTheme function', () => {
    let receivedContext: any = null;

    const Consumer = () => {
      receivedContext = useContext(ThemeContext);
      return null;
    };

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    // Ensure context is set before making assertions
    expect(receivedContext).not.toBeNull();
    expect(receivedContext).toBeDefined();
    expect(receivedContext!.theme).toBeDefined();
    expect(typeof receivedContext!.toggleTheme).toBe('function');
  });
});
