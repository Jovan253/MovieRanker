import React from 'react'
import { createContext, useReducer, useEffect } from 'react'
import AppReducer from './AppReducer';

// initial state
const initialState = {
    movielist: localStorage.getItem('movielist') ? JSON.parse(localStorage.getItem('movielist')) : [],    
};

// create context
export const GlobalContext = createContext(initialState);

// provider components
export const GlobalProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    useEffect(() => {
        localStorage.setItem('movielist', JSON.stringify(state.movielist));
    }, [state]);

    // actions
    const addMovieToList = (movie) => {
        dispatch({type: "ADD_MOVIE_TO_MOVIELIST", payload: movie})
    }

    const setMovielist = (movies) => {
        dispatch({type: "SET_MOVIELIST", payload:movies})
    }

    const removeFromList = (id) => {
        dispatch({type: "REMOVE_FROM_MOVIELIST", payload:id})
    }

    return (
        <GlobalContext.Provider value={{movielist: state.movielist, addMovieToList, setMovielist, removeFromList}}>
            {props.children}
        </GlobalContext.Provider>
    )
}