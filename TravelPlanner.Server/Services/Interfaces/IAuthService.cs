using TravelPlanner.Server.DTO;
using TravelPlanner.Server.Models;

namespace TravelPlanner.Server.Services.Interfaces
{
    public interface IAuthService
    {
        Task<User> AuthenticateUserAsync(string username, string password);
        string GenerateJwtToken(User user);
        Task<bool> RegisterUserAsync(RegisterDto dto);
    }

}
