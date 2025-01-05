using Azure.Identity;

namespace TravelPlanner.Server.DTO
{
    public class RegisterDto
    {
        public  string Username { get; set; }
        public  string PasswordHash { get; set; }
        public string Email { get; set; } 
    }
}
