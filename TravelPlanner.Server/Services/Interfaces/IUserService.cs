namespace TravelPlanner.Server.Services.Interfaces
{
    using System.Threading.Tasks;
    using TravelPlanner.Server.Models;

    public interface IUserService
    {
        Task<User> FindByEmailAsync(string email);
        Task<User> FindByUsernameAsync(string username);
        Task UpdateUserAsync(User user);
        Task<bool> IsEmailTakenAsync(string email);
        Task<bool> IsUsernameTakenAsync(string username);
    }

}
