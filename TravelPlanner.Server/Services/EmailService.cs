namespace TravelPlanner.Server.Services
{
    using System;
    using System.Threading.Tasks;
    using TravelPlanner.Server.Data;
    using TravelPlanner.Server.Services.Interfaces;

    public class EmailService : IEmailService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService; // Service to manage user logic
        private readonly IEmailSender _emailSender; // Helper for sending emails

        public EmailService(ApplicationDbContext context, IUserService userService, IEmailSender emailSender)
        {
            _context = context;
            _userService = userService;
            _emailSender = emailSender;
        }

        public async Task SendPasswordResetEmailAsync(string email)
        {
            var user = await _userService.FindByEmailAsync(email);
            if (user == null)
            {
                throw new ArgumentException("User not found.");
            }

            var resetToken = Guid.NewGuid().ToString();
            user.ResetToken = resetToken;
            user.ResetTokenExpires = DateTime.UtcNow.AddHours(1);

            await _userService.UpdateUserAsync(user);

            var resetUrl = $"http://localhost:4200/confirm-reset-password?token={resetToken}&email={email}";
            var subject = "Password Reset Request";
            var body = $"Click here to reset your password:\n{resetUrl}";

            await _emailSender.SendEmailAsync(email, subject, body);
        }

        public async Task SendVerificationEmailAsync(string email)
        {
            var user = await _userService.FindByEmailAsync(email);
            if (user == null)
            {
                throw new ArgumentException("User not found.");
            }

            var verificationUrl = $"http://localhost:4200/verify-email?token={user.VerificationToken}&email={email}";
            var subject = "Email Verification";
            var body = $"Click here to verify your email address:\n{verificationUrl}";

            await _emailSender.SendEmailAsync(email, subject, body);
        }

    }


}
