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

    public AuthController(IAuthService authService, IWebHostEnvironment env)
    {
        _env = env;
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
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

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var success = await _authService.RegisterUserAsync(registerDto);
        if (!success)
            return Conflict(new { message = "Username or email already exists." });

        return Ok(new { message = "Registration successful." });
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
}