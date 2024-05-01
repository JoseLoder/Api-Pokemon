import './App.css'
import { useEffect, useState } from 'react'
import { CardPokemon } from './components/CardPokemon'

function App() {
  const URL = 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0';

  const [nextUrl, setNextUrl] = useState(URL);
  const [pokemons, setPokemons] = useState([]);
  const [pokedex, setPokedex] = useState([]);

  useEffect(() => {
    fetch(nextUrl)
      .then((response) => response.json())
      .then((data) => {
        setPokemons(data.results);
      });
  }, [nextUrl]);

  useEffect(() => {
    if (pokemons.length === 0) return;
    let promises = pokemons.map((item) => {
      return fetch(item.url)
        .then((response) => response.json())
        .then((data) => {
          return { name: item.name, image: data.sprites.front_default };
        });
    });
    Promise.all(promises)
      .then((newPokemons) => {
        if (pokedex.length > 0) {
          newPokemons = [...pokedex, ...newPokemons];
        }
        setPokedex(newPokemons);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemons]);

  const handleNext = () => {
    // Extraer el offset=0 de la url para sumarle 10
    let offset = parseInt(nextUrl.split('offset=')[1]);
    offset += 10;
    setNextUrl(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`);
  }

  return (
    <>
      <h1>API Pokémon</h1>
      <section className='pokedex'>
        {pokedex.map((pokemon, index) => (
          <CardPokemon key={index} pokemon={pokemon} />
        ))}
      </section>
      <button onClick={handleNext}>Next</button>


    </>
  )
}

export default App
