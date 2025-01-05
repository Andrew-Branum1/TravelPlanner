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
    private readonly IUserService _userService;
    private readonly IEmailService _emailService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var user = await _authService.AuthenticateUserAsync(loginDto.Username, loginDto.Password);
        if (user == null)
            return Unauthorized(new { message = "Invalid username or password." });

        var token = _authService.GenerateJwtToken(user);
        return Ok(new { token });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var success = await _authService.RegisterUserAsync(registerDto);
        if (!success)
            return Conflict(new { message = "Username or email already exists." });

        return Ok(new { message = "Registration successful." });
    }
}