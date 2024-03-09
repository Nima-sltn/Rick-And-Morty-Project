import { HeartIcon } from "@heroicons/react/24/outline";
function Navbar({ children }) {
  return (
    <>
      <nav className="navbar">
        <Logo />
        {children}
      </nav>
    </>
  );
}

export default Navbar;

function Logo() {
  return <div className="navbar__logo">LOGO 😎</div>;
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
export function Favorites({ numOfFavorite }) {
  return (
    <button className="heart">
      <HeartIcon className="icon" />
      <span className="badge">{numOfFavorite}</span>
    </button>
  );
}
