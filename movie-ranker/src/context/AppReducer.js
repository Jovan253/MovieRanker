export default (state, action) => {
    console.log("payload", action.payload)
    switch(action.type) {
        case "ADD_MOVIE_TO_MOVIELIST":
            return {
                ...state,
                movielist: [action.payload, ...state.movielist]
            };
        case "SET_MOVIELIST":
            return {
                ...state,
                movielist: action.payload
            };
        case "REMOVE_FROM_MOVIELIST":
            return {
                ...state,
                movielist: state.movielist.filter(movie => movie.id !== action.payload),
            }
        default: return state;
    }
}