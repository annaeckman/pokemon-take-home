import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  //when site renders, get the list of all pokemon and store in state
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1500")
      .then((res) => res.json())
      .then((json) => setPokemonList(json.results.map(({ name }) => name)));
  }, []);

  //filter the list based on the search term
  const filteredPokemonList = pokemonList.filter((name) => {
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold">Pokemon!</h2>
      <label htmlFor="search"></label>
      <input
        className="w-full bg-blue-100 p-4 rounded-sm m-2 ml-0"
        id="search"
        name="search"
        type="text"
        placeholder="search for your favorite pokemon"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="grid grid-cols-4 gap-4">
        {filteredPokemonList.map((name, index) => (
          <li key={index} className="p-2 border rounded-md">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
