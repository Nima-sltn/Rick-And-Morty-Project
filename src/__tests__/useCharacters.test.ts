import { renderHook, waitFor } from '@testing-library/react';
import useCharacters from '../hooks/useCharacters';
import axios from 'axios';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as any;

describe('useCharacters hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches characters and updates state on success', async () => {
    const mockResponse = {
      data: {
        info: { pages: 2 },
        results: [
          { id: 1, name: 'Rick', status: 'Alive', species: 'Human', gender: 'Male', image: 'rick.png' },
          { id: 2, name: 'Morty', status: 'Alive', species: 'Human', gender: 'Male', image: 'morty.png' },
          { id: 3, name: 'Summer', status: 'Alive', species: 'Human', gender: 'Female', image: 'summer.png' },
          { id: 4, name: 'Beth', status: 'Alive', species: 'Human', gender: 'Female', image: 'beth.png' },
          { id: 5, name: 'Jerry', status: 'Alive', species: 'Human', gender: 'Male', image: 'jerry.png' },
          { id: 6, name: 'Extra', status: 'Alive', species: 'Human', gender: 'Male', image: 'extra.png' },
        ],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    const { result } = renderHook(() => useCharacters('rick', 1));

    // Initially, isLoading should be true
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.characters).toHaveLength(5);
      expect(result.current.totalPages).toBe(2);
    });
  });

  it('handles errors by resetting state', async () => {
    mockedAxios.get.mockRejectedValueOnce({ response: { data: { error: 'Not found' } } });
    const { result } = renderHook(() => useCharacters('nonexistent', 1));

    await waitFor(() => {
      expect(result.current.characters).toEqual([]);
      expect(result.current.totalPages).toBe(1);
    });
  });
});
