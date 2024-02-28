import "./App.css";
import { allCharacters } from "../data/data";
import Navbar from "./components/Navbar";
import CharacterList from "./components/characterList";
import CharacterDetail from "./components/CharacterDetail";
import { useEffect, useState } from "react";

function App() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://rickandmortyapi.com/api/character");
      const data = await res.json();
      setCharacters(data.results.slice(0, 5));
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="app">
        <Navbar numOfResult={characters.length} />
        <div className="main">
          <CharacterList characters={characters} />
          <CharacterDetail />
        </div>
      </div>
    </>
  );
}

export default App;
