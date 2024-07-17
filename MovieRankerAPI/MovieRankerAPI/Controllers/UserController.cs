using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MovieRankerAPI.Data;
using MovieRankerAPI.Entities;

namespace MovieRankerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMongoCollection<User>? _users;
        private readonly IMongoCollection<Movie>? _movies;
        public UserController(MongoDbService mongoDbService) {
            _users = mongoDbService.Database?.GetCollection<User>("user");
            _movies = mongoDbService.Database?.GetCollection<Movie>("movies");
        }

        [HttpGet]
        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _users.Find(FilterDefinition<User>.Empty).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(string id)
        {
            var filter = Builders<User>.Filter.Eq(x => x.Id, id);
            var user = _users.Find(filter).FirstOrDefault();
            return user is not null ? Ok(user) : NotFound();            
        }

        [HttpPost]
        public async Task<ActionResult> CreateUser(User user)
        {
            await _users.InsertOneAsync(user);
            return CreatedAtAction(nameof(GetUserById), new {id = user.Id}, user);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _users.Find(u => u.UserName == request.UserName).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound();
            }

            if (user.Password != request.Password)
            {
                return Unauthorized();
            }

            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(User user)
        {
            var filter = Builders<User>.Filter.Eq(x => x.Id, user.Id);            

            await _users.ReplaceOneAsync(filter, user);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var filter = Builders<User>.Filter.Eq(x => x.Id, id);
            await _users.DeleteOneAsync(filter);
            return Ok();
        }

        [HttpGet("{userId}/movies")]
        public async Task<ActionResult<List<RankedMovieWithDetails>>> GetUserRankedMovies(string userId)
        {
            var user = await _users.Find(u => u.UserName == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User not found");
            }
            /*var movieIds = user.RankedMovies?.Select(rm => rm.MovieId).ToList();
            if (movieIds == null)
            {
                return NotFound("No movies");
            }
            var movies = await _movies.Find(m => movieIds.Contains(m.Id)).ToListAsync();*/
            var rankedMovies = new List<RankedMovieWithDetails>();
            foreach (var rankedMovie in user.RankedMovies)
            {
                var movie = await _movies.Find(m => m.Id == rankedMovie.MovieId).FirstOrDefaultAsync();
                if (movie != null)
                {
                    rankedMovies.Add(new RankedMovieWithDetails
                    {
                        MovieId = rankedMovie.MovieId,
                        Title = movie.Title,
                        PosterUrl = movie.PosterUrl,
                        Rank = rankedMovie.Rank
                    });
                }
            }
            rankedMovies = rankedMovies.OrderBy(rm => rm.Rank).ToList();
            return Ok(rankedMovies);
        }

        [HttpPost("{userId}/movies")]
        public async Task<ActionResult> AddMovieToRankings(string userId, [FromBody] Movie movie)
        {
            if (movie == null)
            {
                return BadRequest("Invalid movie data");
            }

            var existingMovie = await _movies.Find(m => m.Title == movie.Title).FirstOrDefaultAsync();            
            if (existingMovie == null)
            {
                // if movie doesn't exist insert it
                await _movies.InsertOneAsync(movie);
            } else
            {
                movie = existingMovie;
            }

            var userID = await _users.Find(u => u.UserName == userId).FirstOrDefaultAsync();
            if (userID == null)
            {
                return NotFound("User doesnt exist");
            }

            if (userID.RankedMovies == null)
            {
                userID.RankedMovies = new List<RankedMovie>();
            }

            var rankedMovie = new RankedMovie { 
                MovieId = movie.Id, 
                Rank = userID.RankedMovies.Count + 1
            };

            var filter = Builders<User>.Filter.Eq(u => u.UserName, userId);
            var update = Builders<User>.Update.Push(u => u.RankedMovies, rankedMovie);
            await _users.UpdateOneAsync(filter, update);

            return CreatedAtAction(nameof(GetUserRankedMovies), new {userId}, movie);
        }

        [HttpPut("{userId}/movies/rankings")]
        public async Task<ActionResult> UpdateMovieRankings(string userId, [FromBody] List<RankedMovie> rankedMovies)
        {
            if (rankedMovies == null || rankedMovies.Count == 0)
            {
                return BadRequest("Invalid data");
            }
            var user = await _users.Find(u => u.UserName == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User doesn't exist");
            }

            user.RankedMovies = rankedMovies;

            var filter = Builders<User>.Filter.Eq(u => u.UserName, userId);
            var update = Builders<User>.Update.Set(u => u.RankedMovies, user.RankedMovies);

            var result = await _users.UpdateOneAsync(filter, update);

            if (result.ModifiedCount == 0)
            {
                return NotFound("User not found");
            }

            return Ok();
        }

        [HttpDelete("{userName}/movies/{movieId}")]
        public async Task<ActionResult> RemoveRankedMovie(string userName, string movieId)
        {
            var filter = Builders<User>.Filter.Eq(u => u.UserName, userName);
            var update = Builders<User>.Update.PullFilter(u => u.RankedMovies, rm => rm.MovieId == movieId);

            var result = await _users.UpdateOneAsync(filter, update);

            if (result.ModifiedCount == 0)
            {
                return NotFound("User not found");
            }

            return Ok();
        }

        [HttpGet("{userId}/getFriends")]
        public async Task<ActionResult<IEnumerable<User>>> GetFriends(string userId)
        {
            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null) {
                return NotFound("User not found");
            }
            var friends = await _users.Find(u => user.Friends.Contains(u.Id)).ToListAsync();
            return Ok(friends);
        }

        [HttpPost("{userId}/addFriends/{friendName}")]
        public async Task<ActionResult> AddFriend(string userId, string friendName)
        {
            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User not found");
            }

            var friend = await _users.Find(u => u.UserName == friendName).FirstOrDefaultAsync();
            if (friend == null)
            {
                return NotFound("Friend not found");
            }

            var update = Builders<User>.Update.Push(u => u.Friends, friendName);
            await _users.UpdateOneAsync(u => u.Id == userId, update);

            return Ok();
        }

        [HttpDelete("{userId}/friends/{friendName}")]
        public async Task<ActionResult> RemoveFriend(string userId, string friendName)
        {
            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound("User not found");
            }

            var update = Builders<User>.Update.Pull(u => u.Friends, friendName);
            await _users.UpdateOneAsync(u => u.Id == userId, update);

            return Ok();
        }

        /*[HttpGet("{userId}/friends/{friendName}/rankings")]
        public async Task<ActionResult<IEnumerable<RankedMovie>>> GetFriendRankedMovies (string userId, string friendName)
        {
            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User not found");
            }  
            var friend = await _users.Find(u => u.UserName == friendName).FirstOrDefaultAsync();
            if (friend == null)
            {
                return NotFound("Friend not found");
            }

            var movieIds = friend.RankedMovies.Select(rm => rm.MovieId).ToList();
            var movies = await _movies.Find(m => movieIds.Contains(m.Id)).ToListAsync();

            var rankedMovies = friend
        }*/
    }

    public class LoginRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    // Define the RankedMovieWithDetails class
    public class RankedMovieWithDetails
    {
        public string MovieId { get; set; }
        public string Title { get; set; }
        public string PosterUrl { get; set; }
        public int Rank { get; set; }
    }
}
