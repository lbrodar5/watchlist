namespace WatchlistWeb.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Plot { get; set; }
        public string Year { get; set;}
        public string imdbID { get; set; }
        public double imdbRating { get; set;}
        public string Poster {  get; set; }
        public string Genre { get; set;}
        public ICollection<MovieUser> MovieUsers { get; set; }
    }
}
