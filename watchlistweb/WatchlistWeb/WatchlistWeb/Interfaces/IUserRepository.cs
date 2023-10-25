using WatchlistWeb.Models;

namespace WatchlistWeb.Interfaces
{
    public interface IUserRepository
    {
        ICollection<User> GetUsers();
        User GetUser(int id);

        User GetUserByApiKey(string name, int apiKey);
        User GetUserByName(string name);
        User CheckLogin(string name, string password);
        bool UserExists(int id);
        bool AddUser(User user);
        bool DeleteUser(User user);
        bool Login(User user);
        bool LogOut(User user);
       
    }
}
