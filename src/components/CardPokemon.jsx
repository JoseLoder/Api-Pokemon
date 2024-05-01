/* eslint-disable react/prop-types */
import '../styles/CardPokemon.css';

export function CardPokemon({ pokemon }) {
    return (
        <article className='cardPokemon'>
            <h2>{pokemon.name}</h2>{/* Nombre del Pokémon https://pokeapi.co/api/v2/pokemon/1 (.name)*/}
            <figure>
                <img src={pokemon.image}></img>{/* imagen del pokémon https://pokeapi.co/api/v2/pokemon/1 (.sprite.font_defaul)*/}
            </figure>
        </article>
    );
}