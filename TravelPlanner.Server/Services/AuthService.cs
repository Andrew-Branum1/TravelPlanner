namespace TravelPlanner.Server.Services
{
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.IdentityModel.Tokens;
    using TravelPlanner.Server.Data;
    using TravelPlanner.Server.DTO;
    using TravelPlanner.Server.Models;
    using TravelPlanner.Server.Services.Interfaces;

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;

        public AuthService(ApplicationDbContext context, ITokenService tokenService, IEmailService emailService)
        {
            _context = context;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        public async Task<User> AuthenticateUserAsync(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null;
            }
            if (!user.IsEmailVerified)
            {
                throw new UnauthorizedAccessException("Email not verified.");
            }
            return user;
        }

        public string GenerateJwtToken(User user)
        {
            return _tokenService.CreateToken(user.Username);
        }

        public async Task<bool> RegisterUserAsync(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username || u.Email == dto.Email))
            {
                return false;
            }

            var verificationToken = Guid.NewGuid().ToString();

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                VerificationToken = verificationToken,
                VerificationTokenExpires = DateTime.UtcNow.AddHours(24),
                IsEmailVerified = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            await _emailService.SendVerificationEmailAsync(dto.Email);

            return true;
        }

    }


}
