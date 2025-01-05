namespace TravelPlanner.Server.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync(string email);
        Task SendVerificationEmailAsync(string email);
    }

}
