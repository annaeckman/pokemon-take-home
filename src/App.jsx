import { useState, useEffect } from "react";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonByType, setPokemonByType] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const checkResponse = (res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject();
  };

  useEffect(() => {
    //get the list of all pokemon and store in state
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1500")
      .then((res) => checkResponse(res))
      .then((json) => {
        setPokemonList(json.results.map(({ name }) => name));
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));

    // get the types of pokemon and store in state
    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => checkResponse(res))
      .then((json) => {
        setTypeList(json.results.map(({ name }) => name));
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  //filter the list based on the search term
  const filteredBySearchList = pokemonList.filter((name) => {
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  //filter the list by type based on the search term
  const filteredBySearchAndType = pokemonByType.filter((name) => {
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  useEffect(() => {
    if (selectedType === "all") {
      setPokemonByType([]);
      return;
    }
    let isActive = true;

    setIsLoading(true);
    setIsError(false);

    fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
      .then((res) => checkResponse(res))
      .then((json) => {
        if (isActive) {
          const typePokemon = json.pokemon.map((poke) => poke.pokemon.name);
          setPokemonByType(typePokemon); // Set filtered Pokémon by selected type
        }
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [selectedType]);

  const renderPokemonList = () => {
    // rendered list when all is clicked
    if (selectedType === "all") {
      return filteredBySearchList.map((name, index) => (
        <li key={index} className="p-2 border rounded-md hover:bg-blue-100">
          {name}
        </li>
      ));
    }

    // rendered list when any type is clicked
    if (selectedType) {
      return filteredBySearchAndType.map((name, index) => (
        <li key={index} className="p-2 border rounded-md hover:bg-blue-100">
          {name}
        </li>
      ));
    }

    //default list includes all pokemon
    return filteredBySearchList.map((name, index) => (
      <li key={index} className="p-2 border rounded-md hover:bg-blue-100">
        {name}
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

        <ul className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4 mb-[10px]">
          {typeList.map((name, index) => (
            <li key={index}>
              <input
                onChange={handleTypeChange}
                id={name}
                type="radio"
                name="type"
                value={name}
                checked={selectedType === name}
              />
              <label className="pl-1" htmlFor={name}>
                {name}
              </label>
            </li>
          ))}
          <li>
            <input
              onChange={handleTypeChange}
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
      </form>
      {isLoading ? (
        <h2 className="m-5">loading...</h2>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4">
          {renderPokemonList()}
        </ul>
      )}
    </div>
  );
}

export default App;

//TO IMPROVE:
// abstract out repetitive code in the fetches, make a fn that takes the url and the
// on success callback fn
// add UI for when user clicks on pokemon, show picture and stats
// add UI for when no pokemon match the criteria
// add UI for error
// add separate loading and error states for types and pokemon
// refactor this with react query!
// because...
// race condition issue that would be solved with react query
//Click rock and the rock request goes out
// Click ground and the ground request goes out
// Just because of the randomness of how long responses take to come back, the ground response comes back BEFORE the rock response
// The last set state is called with the rock Pokémon, even though the user last clicked on ground
