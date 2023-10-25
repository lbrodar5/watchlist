using Microsoft.AspNetCore.Mvc;
using WatchlistWeb.Dto;
using WatchlistWeb.Interfaces;
using WatchlistWeb.Models;

namespace WatchlistWeb.Controllers
{
    [Route("api/Movies")]
    [ApiController]
    public class MovieControler : Controller
    {
        private readonly IMovieRepository _movieRepository;
        private readonly IUserRepository _userRepository;

        public MovieControler(IMovieRepository movieRepository, IUserRepository userRepository) 
        { 
           _movieRepository = movieRepository;
           _userRepository = userRepository;
        }


        [HttpGet("userMovies")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetUserMovies([FromQuery] string name,[FromQuery] int apiKey)
        {
            var user = _userRepository.GetUserByApiKey(name,apiKey);
            if(user == null || !user.LoggedIn)
            {
                return BadRequest(ModelState);
            }
            var userMovies = _movieRepository.GetUserMovies(user.Id);
            var userMoviesDto = new List<MovieDto>();
            foreach (var movie in userMovies)
            {
                var movieDto = new MovieDto
                {
                    Id = movie.Id,
                    Title = movie.Title,
                    Plot = movie.Plot,
                    Poster = movie.Poster,
                    Genre = movie.Genre,
                    imdbID = movie.imdbID,
                    imdbRating = movie.imdbRating,
                    Year = movie.Year
                };

                userMoviesDto.Add(movieDto);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(userMoviesDto);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult AddMovie([FromQuery] string name, [FromQuery] int apiKey, [FromBody] MovieDto movieDto)
        {
            if (movieDto == null)
            {
                return BadRequest(ModelState);
            }

            var user = _userRepository.GetUserByApiKey(name,apiKey);
            if (user == null || !user.LoggedIn)
            {
                return BadRequest(ModelState);
            }

            if (!_userRepository.UserExists(user.Id))
            {
                ModelState.AddModelError("", "User dosne't exist!");
                return BadRequest(ModelState);
            }

            Movie movie = new Movie
            {
                Id = movieDto.Id,
                Title = movieDto.Title,
                Genre = movieDto.Genre,
                imdbID = movieDto.imdbID,
                imdbRating = movieDto.imdbRating,
                Plot = movieDto.Plot,
                Poster = movieDto.Poster,
                Year = movieDto.Year
            };

            Movie allreadyExistsCheck = _movieRepository.GetMovies().FirstOrDefault(u => 
            u.Title.ToLower() == movieDto.Title.ToLower()
            && u.Plot.ToLower() == movieDto.Plot.ToLower());


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (allreadyExistsCheck != null)
            {
                if (!_movieRepository.AddMovieToTheUser(user, allreadyExistsCheck))
                {
                    ModelState.AddModelError("message", "Something went wrong while saving a movie!");
                    return BadRequest(ModelState);
                }
            }
            else if (!_movieRepository.AddMovie(user,movie))
            {
                ModelState.AddModelError("message", "Something went wrong while saving a movie!");
                return BadRequest(ModelState);
            }
            return Ok();
        }

        [HttpDelete]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteMovie(string imdbId, [FromQuery] string name, [FromQuery] int apiKey)
        {
            var movie = _movieRepository.GetMovieByImdb(imdbId);
            if(movie == null)
            {
                return BadRequest(ModelState);
            }
            var user = _userRepository.GetUserByApiKey(name, apiKey);
            if (user == null || !user.LoggedIn)
            {
                return BadRequest(ModelState);
            }

            if (!_userRepository.UserExists(user.Id))
            {
                ModelState.AddModelError("message", "User dosen't exist!");
                return BadRequest(ModelState);
            }
            if (!_movieRepository.MovieExists(movie.Id))
            {
                ModelState.AddModelError("message", "Movie dosen't exist!");
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid) 
            {
                return BadRequest(ModelState);
            }

            if (!_movieRepository.RemoveMovieUser(movie.Id))
            {
                ModelState.AddModelError("message", "Something went wrong!");
                return BadRequest(ModelState);
            }

            return NoContent();
        }
    }
}
