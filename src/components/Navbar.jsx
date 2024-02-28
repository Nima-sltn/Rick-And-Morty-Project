import { HeartIcon } from "@heroicons/react/24/outline";
function Navbar({ numOfResult }) {
  return (
    <>
      <nav className="navbar">
        <div className="navbar__logo">LOGO 😎</div>
        <input type="text" className="text-field" placeholder="search..." />
        <div className="navbar__result">Found {numOfResult} characters</div>
        <button className="heart">
          <HeartIcon className="icon" />
          <span className="badge">4</span>
        </button>
      </nav>
    </>
  );
}

export default Navbar;
