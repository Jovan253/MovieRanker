using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MovieRankerAPI.Data;
using MovieRankerAPI.Entities;

namespace MovieRankerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly IMongoCollection<Movie>? _movies;

        public MovieController(MongoDbService mongoDbService)
        {
            _movies = mongoDbService.Database?.GetCollection<Movie>("movies");
        }

        [HttpGet("{movieId}")]
        public async Task<ActionResult<Movie>> GetMovieById(string movieId)
        {
            var movie = await _movies.Find(m => m.Id == movieId).FirstOrDefaultAsync();
            if (movie == null)
            {
                return NotFound("Movie not found");
            }

            return Ok(movie);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> GetAllMovies()
        {
            var movies = await _movies.Find(FilterDefinition<Movie>.Empty).ToListAsync();
            return Ok(movies);
        }

        [HttpPost]
        public async Task<ActionResult<Movie>> AddMovie(Movie movie)
        {
            await _movies.InsertOneAsync(movie);
            return CreatedAtAction(nameof(GetMovieById), new { movieId = movie.Id }, movie);
        }
    }
}
