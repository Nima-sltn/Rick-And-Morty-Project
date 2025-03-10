import React, { FC, useState, useContext, ReactNode } from "react";
import { HeartIcon, TrashIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
import { CharacterType, Character } from "./characterList";
import { ThemeContext } from "../context/ThemeContext";

interface NavbarProps {
  children: ReactNode;
}

export const Navbar: FC<NavbarProps> = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext)!;

  return (
    <nav className="navbar">
      <Logo />
      {children}
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? (
          <SunIcon className="icon sun" />
        ) : (
          <MoonIcon className="icon moon" />
        )}
      </button>
    </nav>
  );
};

const Logo: FC = () => <div className="navbar__logo">LOGO 🤩</div>;

interface SearchProps {
  query: string;
  setQuery: (query: string) => void;
}

export const Search: FC<SearchProps> = ({ query, setQuery }) => (
  <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    type="text"
    className="text-field"
    placeholder="search..."
  />
);

interface SearchResultProps {
  numOfResult: number;
}

export const SearchResult: FC<SearchResultProps> = ({ numOfResult }) => (
  <div className="navbar__result">Found {numOfResult} characters</div>
);

interface FavoritesProps {
  favorite: CharacterType[];
  onDeleteFavorite: (id: number) => void;
}

export const Favorites: FC<FavoritesProps> = ({ favorite, onDeleteFavorite }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="List of Favorites">
        {favorite.length === 0 ? (
          <p
            style={{
              width: "100%",
              textAlign: "center",
              color: "white",
            }}
          >
            Favorites List is Empty 😪
          </p>
        ) : (
          favorite.map((item) => (
            <Character key={item.id} item={item}>
              <button
                className="icon red"
                onClick={() => onDeleteFavorite(item.id)}
                aria-label="Delete favorite"
              >
                <TrashIcon />
              </button>
            </Character>
          ))
        )}
      </Modal>
      <button className="heart" onClick={() => setIsOpen(true)} aria-label="Show favorites">
        <HeartIcon className="icon" />
        <span className="badge">{favorite.length}</span>
      </button>
    </>
  );
};

