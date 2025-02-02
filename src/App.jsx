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

  useEffect(() => {
    //get the list of all pokemon and store in state
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1500")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => {
        setPokemonList(json.results.map(({ name }) => name));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
      });

    // get the types of pokemon and store in state
    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => {
        setTypeList(json.results.map(({ name }) => name));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  //component mounts, renders, then runs the useEffect

  //filter the list based on the search term
  const filteredPokemonList = pokemonList.filter((name) => {
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const typeChangeHandler = (event) => {
    // store the selected type in state
    const selectedType = event.target.value;
    setSelectedType(selectedType);

    if (selectedType === "all") {
      return;
    }

    setIsLoading(true);
    fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => {
        const typePokemon = json.pokemon.map((poke) => poke.pokemon.name);
        setFilteredByType(typePokemon); // Set filtered Pokémon by selected type
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
        setIsLoading(false);
      });
  };

  const renderPokemonList = () => {
    // rendered list when all is clicked
    if (selectedType === "all") {
      return filteredPokemonList.map((name, index) => (
        <li key={index} className="p-2 border rounded-md hover:bg-blue-100">
          <a href="">{name}</a>
        </li>
      ));
    }

    // rendered list when any type is clicked
    if (selectedType) {
      return filteredByType.map((name, index) => (
        <li key={index} className="p-2 border rounded-md hover:bg-blue-100">
          <a href="">{name}</a>
        </li>
      ));
    }

    //default list includes all pokemon
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
        {isLoading ? (
          <h2>loading...</h2>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] gap-4 mb-[10px]">
            {typeList.map((name, index) => (
              <li key={index}>
                <input
                  onChange={typeChangeHandler}
                  id={name}
                  type="radio"
                  name="type"
                  value={name}
                  checked={selectedType === name}
                />
                <label className="pl-1" htmlFor="type">
                  {name}
                </label>
              </li>
            ))}
            <li>
              <input
                onChange={typeChangeHandler}
                name="type"
                id="all"
                type="radio"
                value="all"
                checked={selectedType === "all"}
              />
              <label className="pl-1" htmlFor="all">
                all
              </label>
            </li>
          </ul>
        )}
      </form>

      <ul className="grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] gap-4">
        {renderPokemonList()}
      </ul>
    </div>
  );
}

export default App;
