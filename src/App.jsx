import './App.css'
import { useEffect, useState } from 'react'
import { CardPokemon } from './components/CardPokemon'

function App() {
  const URL = 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0';
  const [pokemons, setPokemons] = useState([]);
  const [pokedex, setPokedex] = useState([]);

  useEffect(() => {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setPokemons(data.results);
      });
  }, []);

  useEffect(() => {
    if (pokemons.length === 0) return;
    let promises = pokemons.map((item) => {
      return fetch(item.url)
        .then((response) => response.json())
        .then((data) => {
          return { name: item.name, image: data.sprites.front_default };
        });
    });
    Promise.all(promises).then((newPokemons) => setPokedex(newPokemons));
  }, [pokemons]);



  return (
    <>
      <h1>API Pokémon</h1>
      <section className='pokedex'>
        {pokedex.map((pokemon, index) => (
          <CardPokemon key={index} pokemon={pokemon} />
        ))}
      </section>

    </>
  )
}

export default App
