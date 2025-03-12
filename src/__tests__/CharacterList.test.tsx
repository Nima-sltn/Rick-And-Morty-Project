import { render, screen, fireEvent } from '@testing-library/react';
import CharacterList from '../components/characterList';
import { describe, it, expect, vi } from 'vitest';

const dummyCharacters = [
  { id: 1, name: 'Rick', status: 'Alive', species: 'Human', gender: 'Male', image: 'rick.png' },
  { id: 2, name: 'Morty', status: 'Alive', species: 'Human', gender: 'Male', image: 'morty.png' },
];

describe('CharacterList Component', () => {
  it('renders characters and handles selection', () => {
    const handleSelectCharacter = vi.fn();
    render(
      <CharacterList
        selectedId={null}
        characters={dummyCharacters}
        isLoading={false}
        onSelectCharacter={handleSelectCharacter}
      />
    );
    expect(screen.getByText('Rick')).toBeInTheDocument();
    expect(screen.getByText('Morty')).toBeInTheDocument();

    const selectButtons = screen.getAllByRole('button');
    fireEvent.click(selectButtons[0]);
    expect(handleSelectCharacter).toHaveBeenCalledWith(1);
  });
});
