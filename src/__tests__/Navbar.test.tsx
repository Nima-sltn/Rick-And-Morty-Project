import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar, Search, SearchResult, Favorites } from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { describe, it, expect, vi } from 'vitest';

describe('Navbar Component', () => {
  it('renders children correctly', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: vi.fn() }}>
        <Navbar>
          <div>Child Component</div>
        </Navbar>
      </ThemeContext.Provider>
    );
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('calls toggleTheme when the theme button is clicked', () => {
    const toggleTheme = vi.fn();
    render(
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme }}>
        <Navbar>
          <div>Child Component</div>
        </Navbar>
      </ThemeContext.Provider> 
    );
    const themeButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(themeButton);
    expect(toggleTheme).toHaveBeenCalled();
  });
});

describe('Search Component', () => {
  it('renders input with given value and updates on change', () => {
    const setQuery = vi.fn();
    render(<Search query="test" setQuery={setQuery} />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toHaveValue("test");
    fireEvent.change(input, { target: { value: 'new query' } });
    expect(setQuery).toHaveBeenCalledWith('new query');
  });
});

describe('SearchResult Component', () => {
  it('displays the correct number of results', () => {
    render(<SearchResult numOfResult={5} />);
    expect(screen.getByText(/found 5 characters/i)).toBeInTheDocument();
  });
});

describe('Favorites Component', () => {
  const dummyFavorites = [
    { id: 1, name: 'Rick', status: 'Alive', species: 'Human', gender: 'Male', image: 'rick.png' },
  ];

  it('renders favorite count badge', () => {
    render(<Favorites favorite={dummyFavorites} onDeleteFavorite={vi.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('opens modal when heart button is clicked', () => {
    render(<Favorites favorite={dummyFavorites} onDeleteFavorite={vi.fn()} />);
    const heartButton = screen.getByRole('button', { name: /show favorites/i });
    fireEvent.click(heartButton);
    expect(screen.getByText(/list of favorites/i)).toBeInTheDocument();
  });
});
