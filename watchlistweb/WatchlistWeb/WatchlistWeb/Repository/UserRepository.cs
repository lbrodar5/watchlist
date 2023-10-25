
using WatchlistWeb.Data;
using WatchlistWeb.Interfaces;
using WatchlistWeb.Models;


namespace WatchlistWeb.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }
        public User GetUser(int id)
        {
            return _context.Users.Where(u => u.Id == id).FirstOrDefault();
        }

        public ICollection<User> GetUsers()
        {
            return _context.Users.ToList();
        }

        public bool UserExists(int id)
        {
           return _context.Users.Any(u => u.Id == id);
        }

        public bool AddUser(User user)
        {
            _context.Add(user);

            return Save();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool Login(User user)
        {
            _context.Update(user);
            return Save(); ;
        }
        
        public bool DeleteUser(User user)
        {
            _context.Remove(user);
            return Save();
        }
        public bool LogOut(User user)
        {
            _context.Update(user);
            return Save();
        }

        public User CheckLogin(string name, string password)
        {
            return _context.Users.Where(u => u.Name == name && u.Password == password).FirstOrDefault();
        }

        public User GetUserByName(string name)
        {
            return _context.Users.Where(u => u.Name == name).FirstOrDefault();
        }

        public User GetUserByApiKey(string name, int apiKey)
        {
            return _context.Users.Where(u => u.ApiKey == apiKey && u.Name == name).FirstOrDefault();
        }
    }
}
