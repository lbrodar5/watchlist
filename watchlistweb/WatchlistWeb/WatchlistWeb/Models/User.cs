using System.Diagnostics.CodeAnalysis;

namespace WatchlistWeb.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public int ApiKey {get; set;} 
        public bool LoggedIn { get; set; }
        public ICollection<MovieUser> MovieUsers { get; set; }
    }
}
