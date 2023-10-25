using WatchlistWeb.Dto;
using WatchlistWeb.Models;

namespace WatchlistWeb.Interfaces
{
    public interface IMovieRepository
    {
        public ICollection<Movie> GetMovies();
        public Movie GetMovie(int id);
        public Movie GetMovieByImdb(string imdbId);
        public bool MovieExists(int id);
        public ICollection<Movie> GetUserMovies(int userId);
        public bool AddMovie(User user,Movie movie);
        public bool AddMovieToTheUser(User user, Movie movie);
        public bool RemoveMovie(Movie movie);
        public bool RemoveMovieUser(int movieId);
        public bool Save();
    }
}
