using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TravelPlanner.Server.Data;
using TravelPlanner.Server.DTO;
using TravelPlanner.Server.Models;
using TravelPlanner.Server.Services;
using TravelPlanner.Server.Services.Interfaces;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IWebHostEnvironment _env;
    private readonly IUserService _userService;
    private readonly IEmailService _emailService;

    public AuthController(IAuthService authService, IWebHostEnvironment env, IUserService userService, IEmailService emailService)
    {
        _env = env;
        _authService = authService;
        _userService = userService;
        _emailService = emailService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var user = await _authService.AuthenticateUserAsync(loginDto.Username, loginDto.Password);
            if (user == null)
                return Unauthorized(new { message = "Invalid username or password." });

            var token = _authService.GenerateJwtToken(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = _env.IsProduction(), // Use secure cookies in production
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            };

            Response.Cookies.Append("authToken", token, cookieOptions);

            return Ok(new { message = "Login successful." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            var success = await _authService.RegisterUserAsync(registerDto);
            if (!success)
                return Conflict(new { message = "Username or email already exists." });

            return Ok(new { message = "Registration successful." });
        }
        catch (DbUpdateException dbEx)
        {
            Console.Error.WriteLine($"Database error during registration: {dbEx.InnerException?.Message ?? dbEx.Message}");
            return StatusCode(500, new { message = "An error occurred during registration." });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Registration failed: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred during registration." });
        }
    }


    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("authToken");
        return Ok(new { message = "Logout successful." });
    }


    [HttpGet("authenticated")]
    public IActionResult GetAuthenticated()
    {
        if (Request.Cookies.ContainsKey("authToken"))
        {
            var token = Request.Cookies["authToken"];
            Console.WriteLine($"authToken received: {token}");
        }
        else
        {
            Console.WriteLine("No authToken cookie found.");
        }

        return User?.Identity?.IsAuthenticated == true
            ? Ok(new { Username = User.Identity.Name })
            : Unauthorized(new { message = "Unauthorized access." });
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto dto)
    {
        var user = await _userService.FindByEmailAsync(dto.Email);
        if (user == null || user.VerificationToken != dto.Token || user.VerificationTokenExpires < DateTime.UtcNow)
        {
            return BadRequest(new { message = "Invalid or expired token." });
        }

        user.IsEmailVerified = true;
        user.VerificationToken = "";
        user.VerificationTokenExpires = null;

        await _userService.UpdateUserAsync(user);

        return Ok(new { message = "Email verified successfully." });
    }

    [HttpPost("resend-verification-email")]
    public async Task<IActionResult> ResendVerificationEmail([FromBody] ResendVerificationRequestDto request)
    {
        var user = await _userService.FindByEmailAsync(request.Email);
        if (user == null || user.IsEmailVerified)
        {
            return BadRequest(new { message = "User not found or already verified." });
        }

        await _emailService.SendVerificationEmailAsync(request.Email);
        return Ok(new { message = "Verification email resent." });
    }


}