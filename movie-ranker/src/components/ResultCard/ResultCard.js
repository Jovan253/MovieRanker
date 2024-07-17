import React, { useState } from 'react'
import { useContext } from 'react'
import { GlobalContext } from '../../context/GlobalState'
import './ResultCard.css'
import { useAuth } from '../../context/AuthState';

export const ResultCard = ({movie}) => {
    const {addMovieToList, movielist} = useContext(GlobalContext);
    const [selectedMovie, setSelectedMovie] = useState(false);
    let storedMovie = movielist.find((x) => x.id === movie.id);
    const movielistDisabled = storedMovie ? true : false;
    const {user} = useAuth();

    const handleAddMovie = async (movie) => {
        if (user) {            
            // console.log(movie);
            try {
                const response = await fetch(`http://localhost:5098/api/User/${user}/movies`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        id:null, title:movie.title, description: movie.overview, posterUrl: movie.poster_path, genre: movie.title
                    })
                });
                // const userData = await response.json();
    
                if (response.ok) {
                    // console.log("hopefully added")
                    setSelectedMovie(true);
                } else {
                    console.error('Adding failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            addMovieToList(movie);
        }
    }

    return (
        <div className='result-card'>
            <div className='poster-wrapper'>
                {movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={`${movie.title} Poster`}/>
                ) : (
                    <div className='filler-poster'>
                    </div>
                )}
            </div>
            <div className='info'>
                <div className='header'>
                    <h3 className='title'>{movie.title}</h3>
                    <h4 className='release-date'>
                        {movie.release_date ? movie.release_date.substring(0,4) : '-'}
                    </h4>                
                </div>
                <div className='controls'>
                    <button className='btn' disabled={movielistDisabled || selectedMovie} onClick={() => handleAddMovie(movie)}>
                        Add to List
                    </button>
                </div>
            </div>
        </div>
    )
}
