import "./App.css";
import Navbar from "./components/Navbar";
import CharacterList from "./components/characterList";
import CharacterDetail from "./components/CharacterDetail";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function App() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          "https://rickandmortyapi.com/api/characterss"
        );
        setCharacters(data.results.slice(0, 5));
      } catch (err) {
        toast.error(err.response.data.error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);
  //       const res = await fetch("https://rickandmortyapi.com/api/characterss");

  //       if (!res.ok) throw new Error("something went wrong");

  //       const data = await res.json();
  //       setCharacters(data.results.slice(0, 5));
  //     } catch (err) {
  //       toast.error(err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);

  return (
    <>
      <div className="app">
        <Toaster />
        <Navbar numOfResult={characters.length} />
        <div className="main">
          <CharacterList characters={characters} isLoading={isLoading} />
          <CharacterDetail />
        </div>
      </div>
    </>
  );
}

export default App;
