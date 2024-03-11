import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import toast from "react-hot-toast";

function CharacterDetail({ selectedId, onAddFavorite, isAddToFavorite }) {
  const [character, setCharacter] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/${selectedId}`
        );
        setCharacter(data);

        const episodesId = data.episode.map((e) => e.split("/").at(-1));
        const { data: episodeData } = await axios.get(
          `https://rickandmortyapi.com/api/episode/${episodesId}`
        );
        setEpisodes([episodeData].flat().slice(0, 5));
      } catch (err) {
        toast.error(err.response.data.error);
      } finally {
        setIsLoading(false);
      }
    }
    if (selectedId) fetchData();
  }, [selectedId]);

  if (isLoading) return <Loader />;

  if (!selectedId || !character)
    return (
      <div
        className="character-detail__container"
        style={{ flex: 1, color: "var(--slate-300)" }}>
        Please select a character.
      </div>
    );

  return (
    <>
      <div style={{ flex: 1 }}>
        <CharacterSubInfo
          character={character}
          onAddFavorite={onAddFavorite}
          isAddToFavorite={isAddToFavorite}
        />
        <EpisodeList episodes={episodes} />
      </div>
    </>
  );
}

export default CharacterDetail;

function CharacterSubInfo({ character, onAddFavorite, isAddToFavorite }) {
  return (
    <>
      <div className="character-detail">
        <img
          src={character.image}
          alt={character.name}
          className="character-detail__img"
        />
        <div className="character-detail__info">
          <h3 className="name">
            <span>{character.gender === "Male" ? "👨🏻‍🦱" : "👩🏻‍🦱"}</span>
            <span>&nbsp;{character.name}</span>
          </h3>
          <div className="info">
            <span
              className={`status ${
                character.status === "Dead" ? "red" : ""
              }`}></span>
            <span>&nbsp;{character.status}</span>
            <span> - &nbsp;{character.species}</span>
          </div>
          <div className="location">
            <p>Last known location:</p>
            {/* <p>{character.location}</p> */}
          </div>
          <div className="actions">
            {isAddToFavorite ? (
              <p>Already Added To Favorites✅</p>
            ) : (
              <button
                className="btn btn--primary"
                onClick={() => onAddFavorite(character)}>
                Add to Favorite
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function EpisodeList({ episodes }) {
  const [sortBy, setSortBy] = useState(true);

  let sortedEpisodes;

  if (sortBy) {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(a.created) - new Date(b.created)
    );
  } else {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
  }

  return (
    <>
      <div className="character-episodes">
        <div className="title">
          <h2>List of Episodes:</h2>
          <button onClick={() => setSortBy((is) => !is)}>
            <ArrowUpCircleIcon
              className="icon"
              style={{ rotate: sortBy ? "0deg" : "180deg" }}
            />
          </button>
        </div>
        <ul>
          {sortedEpisodes.map((item, index) => (
            <li key={item.id}>
              <div>
                {String(index + 1).padStart(2, "0")}-{item.episode} : &nbsp;
                <strong>{item.name}</strong>
              </div>
              <div className="badge badge--secondary">{item.air_date}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
