using Microsoft.EntityFrameworkCore;

namespace TravelPlanner.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Define DbSets for your entities
        public DbSet<User> Users { get; set; }
        public DbSet<Flight> Flights { get; set; }
    }

    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }

        public string PasswordHash { get; set; }
        public string Email { get; set; }
    }

    public class Flight
    {
        public int Id { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public DateTime Date { get; set; }
    }
}
