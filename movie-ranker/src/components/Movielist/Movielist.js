import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { GlobalContext } from '../../context/GlobalState'
import { MovieCard } from '../MovieCard/MovieCard';
import "./Movielist.css"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useAuth } from '../../context/AuthState';

export const Movielist = () => {
  const {user} = useAuth();
  const {movielist, setMovielist} = useContext(GlobalContext);
  const [movies, setMovies] = useState(movielist);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("user list")
      fetchMoviesFromDatabase();
    } else {
      console.log(movielist)
      setMovies(movielist); // Sync state with global context
    }    
  }, [movielist, user]);

  const fetchMoviesFromDatabase = async () => {
    try {      
      const response = await fetch(`http://localhost:5098/api/User/${user}/movies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      // console.log(response);
      if (response.status == 200){
        const data = await response.json();        
        const transformedMovies = data.map(movie => ({
          ...movie,
          id: movie.movieId,
          poster_path: movie.posterUrl // Assuming the original property is posterUrl
        }));    
        console.log(transformedMovies)    
        setMovies(transformedMovies);
      } else if (response.status == 404){
        console.log("404");
        setMovies([]);
      } else {
        console.log("ERROR");
      }
    } catch(error){
      console.log(error);
    }
  }

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;    
    const items = Array.from(movies);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setMovies(items);
    setDragging(true);
    if (!user) {      
      setMovielist(items);
    }    
  }

  const handleUpdate = async () => {
    if (user) {
      try {
        const rankedMovies = movies.map((movie, index) => ({
          MovieId: movie.id,
          Rank: index + 1
        }))
        console.log(rankedMovies)
        const response = await fetch(`http://localhost:5098/api/User/${user}/movies/rankings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(rankedMovies)
        });

        if (response.ok) {
          console.log("Rankings updated successfully");          
        } else {
          console.error("Failed to update rankings");
        }
      } catch(error) {
        console.error(error);
      }
    }
    setDragging(false);
  }

  return (
    <div className="movie-page">
      <div className="container"> 
        {user && dragging && (
          <button className='btn' onClick={handleUpdate}>Update</button>
        )}   
        <DragDropContext onDragEnd={handleOnDragEnd}> 
          <Droppable droppableId="movies">  
            {(provided) => (
              <div className='movie-grid' {...provided.droppableProps} ref={provided.innerRef}>
                {movies.length > 0 ? (                  
                  movies.map((movie, index) => (
                    <Draggable key={movie.id} draggableId={movie.id.toString()} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <MovieCard key={index} movie={movie} index={index + 1}/>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <h2 className='no-movies'>No movies added</h2>
                )}
                {provided.placeholder}
              </div>
            )}             
          </Droppable>     
        </DragDropContext>    
        {user && dragging && (
          <button className='btn' onClick={handleUpdate}>Update</button>
        )}    
      </div>
    </div>
  )
}
