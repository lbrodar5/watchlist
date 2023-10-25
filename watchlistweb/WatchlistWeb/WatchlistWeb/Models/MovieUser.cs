namespace WatchlistWeb.Models
{
    public class MovieUser
    {
        public int Id { get; set; }
        public Movie Movie { get; set; }
        public User User { get; set; }
    }
}
