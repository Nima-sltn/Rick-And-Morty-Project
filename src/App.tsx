import React, { FC, ReactNode, useState, useCallback, useMemo } from "react";
import "./App.css";
import  { Favorites, Search, SearchResult,Navbar } from "./components/Navbar";
import CharacterList from "./components/characterList";
import CharacterDetail from "./components/CharacterDetail";
import { Toaster } from "react-hot-toast";
import useCharacters from "./hooks/useCharacters";
import useLocalStorage from "./hooks/useLocalStorage";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

const App: FC = () => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const { isLoading, characters, totalPages } = useCharacters(query, page);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [favorite, setFavorite] = useLocalStorage<Character[]>("FAVORITES", []);

  const handleSelectCharacter = useCallback((id: number) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  }, []);

  const handleAddFavorite = useCallback((char: Character) => {
    setFavorite((prevFav) => [...prevFav, char]);
  }, [setFavorite]);

  const handleDeleteFavorite = useCallback((id: number) => {
    setFavorite((prevFav) => prevFav.filter((fav) => fav.id !== id));
  }, [setFavorite]);

  const isAddToFavorite = useMemo(
    () => selectedId !== null && favorite.some((fav) => fav.id === selectedId),
    [selectedId, favorite]
  );

  const renderPageNumbers = useMemo(() => {
    const pages: JSX.Element[] = [];
    const maxPagesToShow = window.innerWidth < 768 ? 3 : 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={page === i ? "active" : ""}
          onClick={() => setPage(i)}
          disabled={isLoading}
        >
          {i}
        </button>
      );
    }
    return pages;
  }, [page, totalPages, isLoading]);

  return (
    <div className="app">
      <Toaster />
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult numOfResult={characters.length} />
        <Favorites favorite={favorite} onDeleteFavorite={handleDeleteFavorite} />
      </Navbar>
      <Main>
        <CharacterList
          selectedId={selectedId}
          characters={characters}
          isLoading={isLoading}
          onSelectCharacter={handleSelectCharacter}
        />
        <CharacterDetail
          selectedId={selectedId}
          onAddFavorite={handleAddFavorite}
          isAddToFavorite={isAddToFavorite}
          onCloseSelectedCharacter={() => setSelectedId(null)}
        />
      </Main>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </button>
          {renderPageNumbers}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages || isLoading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

interface MainProps {
  children: ReactNode;
}

const Main: FC<MainProps> = ({ children }) => <div className="main">{children}</div>;
