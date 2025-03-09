import { HeartIcon, TrashIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useState, useContext } from "react";
import Modal from "./Modal";
import { Character } from "./characterList";
import { ThemeContext } from "../context/ThemeContext";

function Navbar({ children }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <Logo />
      {children}
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? <SunIcon className="icon sun" /> : <MoonIcon className="icon moon" />}
      </button>
    </nav>
  );
}

export default Navbar;

function Logo() {
  return <div className="navbar__logo">LOGO 🤩</div>;
}
export function Search({ query, setQuery }) {
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      type="text"
      className="text-field"
      placeholder="search..."
    />
  );
}

export function SearchResult({ numOfResult }) {
  return <div className="navbar__result">Found {numOfResult} characters</div>;
}

export function Favorites({ favorite, onDeleteFavorite }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Modal onOpen={setIsOpen} open={isOpen} title="List of Favorites">
        {favorite.length === 0 ? (
          <p
            style={{
              width: "100%",
              textAlign: "center",
              color: "white",
            }}>
            Favorites List is Empty 😪
          </p>
        ) : (
          favorite.map((item) => (
            <Character key={item.id} item={item}>
              <button
                className="icon red"
                onClick={() => onDeleteFavorite(item.id)}>
                <TrashIcon />
              </button>
            </Character>
          ))
        )}
      </Modal>
      <button className="heart" onClick={() => setIsOpen(true)}>
        <HeartIcon className="icon" />
        <span className="badge">{favorite.length}</span>
      </button>
    </>
  );
}
