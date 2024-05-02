import './App.css'
import { useEffect, useRef, useState } from 'react'
import { CardPokemon } from './components/CardPokemon'

function App() {
  const URL = 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0';

  const [nextUrl, setNextUrl] = useState(URL); // URL de la próxima página de datos.
  const [pokemons, setPokemons] = useState([]); // Lista de pokemons de la página actual.
  const [pokedex, setPokedex] = useState([]); // Lista de pokemons en la pokedex (Donde se van a ir sumando todos los pokémons cuando se vayan cargando).

  useEffect(() => {
    fetch(nextUrl)
      .then((response) => response.json())
      .then((data) => {
        setPokemons(data.results);
      });
  }, [nextUrl]);

  useEffect(() => {
    if (pokemons.length === 0) return;
    let promises = pokemons.map((item) => { //Almacenamos las promesas en un arreglo ya que tenemos que hacer una petición por cada pokemon.
      return fetch(item.url)
        .then((response) => response.json())
        .then((data) => {
          return { name: item.name, image: data.sprites.front_default };
        });
    });
    Promise.all(promises) // Promise.all nos permite esperar a que todas las promesas se resuelvan antes de continuar.
      .then((newPokemons) => {
        if (pokedex.length > 0) { //Si ya tenemos pokemons en la pokedex, los concatenamos con los nuevos.
          newPokemons = [...pokedex, ...newPokemons];
        }
        setPokedex(newPokemons);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemons]);

  // Implementación de scroll infinito utilizando useEffect.
  // Primero, definimos una función (handleScrollNext) que detecta cuando el usuario llega al final de la página.
  // Para ello, utilizamos las propiedades scrollTop, clientHeight y scrollHeight del objeto document.documentElement.
  // Cuando la suma de scrollTop y clientHeight es mayor o igual a scrollHeight, significa que el usuario ha llegado al final de la página.
  // En ese caso, ejecutamos la función handleButtonNext.
  // Sin embargo, dado que handleButtonNext puede cambiar durante el ciclo de vida del componente, utilizamos useRef para almacenar una referencia a la función actual.
  // De esta manera, siempre podemos acceder a la versión más reciente de handleButtonNext dentro de handleScrollNext.
  // Luego, agregamos handleScrollNext como un evento de scroll al objeto window.
  // Esto es necesario porque queremos detectar el scroll en toda la ventana, no solo en un elemento específico.
  // Si quisieramos que el scroll infinito se aplique a un elemento específico,
  // podríamos agregar el evento de scroll a ese elemento en lugar de window, pero este elemento tendría que tener desbordamiento de scroll que no es el caso.
  // Finalmente, retornamos una función de limpieza que elimina el evento de scroll cuando el componente se desmonta.
  // Esto es importante para evitar fugas de memoria.

  useEffect(() => {
    const handleScrollNext = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
        handleButtonNextRef.current();
      }
    }

    window.addEventListener('scroll', handleScrollNext);
    return () => window.removeEventListener('scroll', handleScrollNext);
  }, []);

  // La función handleButtonNext se encarga de actualizar la URL para la próxima página de datos.
  // Primero, extrae el valor actual de offset de la URL.
  // Luego, incrementa este valor en 10 y construye una nueva URL con el nuevo valor de offset.
  // Finalmente, actualiza el estado nextUrl con la nueva URL.
  // Es por ello que necesitamos almacenarlo en un useRef para poder acceder a la versión más reciente de la función dentro de handleScrollNext.
  const handleButtonNext = () => {
    let offset = parseInt(nextUrl.split('offset=')[1]);
    offset += 10;
    setNextUrl(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`);
  }

  // Creamos una referencia a handleButtonNext utilizando useRef.
  // Esto nos permite acceder a la versión más reciente de handleButtonNext dentro de handleScrollNext, incluso si handleButtonNext cambia.
  const handleButtonNextRef = useRef();
  handleButtonNextRef.current = handleButtonNext;

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
