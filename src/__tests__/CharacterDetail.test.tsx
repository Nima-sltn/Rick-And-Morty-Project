import { render, screen } from '@testing-library/react';
import CharacterDetail from '../components/CharacterDetail';
import { describe, it, expect, vi } from 'vitest';

describe('CharacterDetail Component', () => {
  it('renders a prompt when no character is selected', () => {
    render(
      <CharacterDetail
        selectedId={null}
        onAddFavorite={vi.fn()}
        isAddToFavorite={false}
        onCloseSelectedCharacter={vi.fn()}
      />
    );
    expect(screen.getByText(/please select a character/i)).toBeInTheDocument();
  });
});
