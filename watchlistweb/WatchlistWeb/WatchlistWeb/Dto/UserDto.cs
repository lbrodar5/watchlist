
namespace WatchlistWeb.Dto
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public int ApiKey { get; set; }
        public bool LoggedIn { get; set; }
    }
}
