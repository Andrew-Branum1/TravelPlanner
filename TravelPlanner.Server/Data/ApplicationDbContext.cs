using Microsoft.EntityFrameworkCore;
using TravelPlanner.Server.Models;

namespace TravelPlanner.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Define DbSets for your entities
        public DbSet<User> Users { get; set; }
        public DbSet<Flight> Flights { get; set; }

    }  

}
