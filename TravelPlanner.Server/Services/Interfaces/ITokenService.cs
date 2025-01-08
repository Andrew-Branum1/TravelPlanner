namespace TravelPlanner.Server.Services.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(string username);
    }
}
