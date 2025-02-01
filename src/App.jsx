import { useState, useEffect } from "react";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  //tells me we're awaiting the pokemon list response, response from the server
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [typeList, setTypeList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [filteredByType, setFilteredByType] = useState([]);
  // react setState can be resolved asynchronously...
  // review how useEffects work...

  //when site renders, get the list of all pokemon and store in state
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1500")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        setIsError(true);
        // what if when there's an error, make a button that says try again???
        // maybe the useEffect calls a resusable function so that i can call it later
        setIsLoading(false);
        return Promise.reject();
      })
      .then((json) => {
        setPokemonList(json.results.map(({ name }) => name));
        setIsLoading(false);
      });
    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => res.json())
      .then((json) => {
        setTypeList(json.results.map(({ name }) => name));
      });
  }, []);

  //component mounts, renders, then runs the useEffect

  //filter the list based on the search term
  const filteredPokemonList = pokemonList.filter((name) => {
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const typeClickHandler = (event) => {
    const selectedType = event.target.value;
    setSelectedType(selectedType);
    setIsLoading(true);
    fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
      .then((res) => res.json())
      .then((json) => {
        const typePokemons = json.pokemon.map((poke) => poke.pokemon.name);
        setFilteredByType(typePokemons); // Set filtered Pokémon by selected type
        setIsLoading(false);
      });
  };

  const renderPokemonList = () => {
    if (selectedType) {
      return filteredByType.map((name, index) => (
        <li key={index} className="p-2 border rounded-md hover:bg-blue-100">
          <a href="">{name}</a>
        </li>
      ));
    }

    return filteredPokemonList.map((name, index) => (
      <li key={index} className="p-2 border rounded-md hover:bg-blue-100">
        <a href="">{name}</a>
      </li>
    ));
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold">Pokemon!</h2>
      <form action="">
        <label htmlFor="search"></label>
        <input
          className="w-full bg-blue-100 p-2 border rounded-md m-2 ml-0"
          id="search"
          name="search"
          type="text"
          placeholder="search for your favorite pokemon!"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] gap-4 mb-[10px]">
          {typeList.map((name, index) => (
            <li key={index}>
              <input
                onClick={typeClickHandler}
                id="type"
                type="radio"
                name="type"
                value={name}
              ></input>
              <label className="pl-1" htmlFor="type">
                {name}
              </label>
            </li>
          ))}
          <li>
            <input name="type" id="all" type="radio" />
            <label className="pl-1" htmlFor="all">
              all
            </label>
          </li>
        </ul>
      </form>

      <ul className="grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] gap-4">
        {renderPokemonList()}
      </ul>
    </div>
  );
}

export default App;
