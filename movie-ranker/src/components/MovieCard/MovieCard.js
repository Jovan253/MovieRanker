import React, { useContext } from 'react'
import "./MovieCard.css"
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../context/AuthState';
import { GlobalContext } from '../../context/GlobalState';
import config from '../../utils/config';


export const MovieCard = ({movie, index}) => {  
  const {user} = useAuth();
  const {removeFromList} = useContext(GlobalContext);


  const handleDeleteMovie = async (movie) => {
    console.log("delete it", movie);
    if (user){
      const response = await fetch(`${config.apiUrl}/api/User/${user}/movies/${movie.id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },          
      });
      // const userData = await response.json();

      if (response.ok) {
          console.log("deleted from db");
          window.location.reload();
      } else {
          console.error('Login failed');
      }
    } else {      
      removeFromList(movie.id);      
    }
  };

  return (
    <div className='movie-card'>
        <h1 className='movie-number'>{index}</h1>
        <div className='movie-info'>
          {movie.poster_path ? (                            
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={`${movie.title} Poster`} className='movie-image'/>                                                                    
          ) : (
              <div className='filler-poster'>
              </div>
          )}
          <h1 className='movie-title'>{movie.title}</h1>  
          <FontAwesomeIcon icon={faTrash} className='delete-icon' onClick={() => handleDeleteMovie(movie)}/>
        </div>
    </div>
  )
}
