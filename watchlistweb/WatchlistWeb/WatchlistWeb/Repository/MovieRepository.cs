
using WatchlistWeb.Data;
using WatchlistWeb.Interfaces;
using WatchlistWeb.Models;

namespace WatchlistWeb.Repository
{
    public class MovieRepository : IMovieRepository
    {
        private readonly DataContext _context;

        public MovieRepository(DataContext context) 
        { 
        _context = context;
        }
           
        public ICollection<Movie> GetMovies()
        {
            return _context.Movies.OrderBy(p => p.Id).ToList();
        }

        public Movie GetMovie(int id)
        {
            return _context.Movies.FirstOrDefault(p => p.Id == id);
        }

        public bool MovieExists(int id)
        {
            return _context.Movies.Any(p => p.Id == id);
        }

        public ICollection<Movie> GetUserMovies(int userId)
        {
            return _context.MovieUsers.Where(p => p.User.Id == userId).Select(o => o.Movie).ToList();
        }

        public bool AddMovie(User user, Movie movie) 
        {
            var movieUser = new MovieUser 
            { 
                Movie = movie,
                User = user 
            };
            _context.Add(movieUser);
            _context.Add(movie);
            return Save();
        }

        public bool AddMovieToTheUser(User user, Movie movie)
        {
            var movieUser = new MovieUser
            {
                Movie = movie,
                User = user
            };
            _context.Add(movieUser);
            return Save();
        }

        public bool Save() 
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
        public bool RemoveMovie(Movie movie)
        {
            var movieUsers = _context.MovieUsers.Where(p => p.Movie.Id == movie.Id).ToList();
            foreach (var m in movieUsers)
            {
                _context.Remove(m);
            }
            _context.Remove(movie);
            return Save();
        }

        public bool RemoveMovieUser(int movieId)
        {
            var moveUser = _context.MovieUsers.Where(p => p.Movie.Id == movieId).FirstOrDefault();
            _context.Remove(moveUser);
            return Save();
        }

        public Movie GetMovieByImdb(string imdbId)
        {
            return _context.Movies.Where(m => m.imdbID == imdbId).FirstOrDefault();
        }
    }
}
