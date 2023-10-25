using Microsoft.EntityFrameworkCore;
using WatchlistWeb.Models;

namespace WatchlistWeb.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) 
        { 
        }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<MovieUser> MovieUsers { get; set; }
    }
}
