import "./App.css";
import Navbar from "./components/Navbar";
import CharacterList from "./components/characterList";
import { allCharacters } from "../data/data";

function App() {
  return (
    <>
      <div className="app">
        <Navbar />
        <div className="main">
          <CharacterList characters={allCharacters} />
        </div>
      </div>
    </>
  );
}

export default App;
