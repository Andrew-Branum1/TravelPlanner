using Microsoft.AspNetCore.Mvc;
using TravelPlanner.Server.DTO;
using TravelPlanner.Server.Services;
using TravelPlanner.Server.Services.Interfaces;

namespace TravelPlanner.Server.Controllers
{
    [ApiController]
    [Route("api/emails")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;

        public EmailController(IEmailService emailService, IUserService userService)
        {
            _emailService = emailService;
            _userService = userService;
        }

        [HttpPost("send-reset-password")]
        public async Task<IActionResult> SendPasswordResetEmail([FromBody] ResetPasswordDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            var user = await _userService.FindByEmailAsync(request.Email);
            if (user == null)
                return NotFound(new { message = "User not found." });

            try
            {
                await _emailService.SendPasswordResetEmailAsync(request.Email);
                return Ok(new { message = "Password reset email sent." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while sending the reset email.", error = ex.Message });
            }
        }


        [HttpPost("send-verification-email")]
        public async Task<IActionResult> SendVerificationEmail([FromBody] EmailVerificationRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            // Send the email
            await _emailService.SendVerificationEmailAsync(request.Email);

            return Ok(new { message = "Verification email sent." });
        }


        [HttpPost("confirm-reset-password")]
        public async Task<IActionResult> ConfirmResetPassword([FromBody] ConfirmResetPasswordDto dto)
        {
            var user = await _userService.FindByEmailAsync(dto.Email);
            if (user == null || user.ResetToken != dto.Token || user.ResetTokenExpires < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Invalid or expired token." });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.ResetToken = string.Empty;
            user.ResetTokenExpires = null;

            await _userService.UpdateUserAsync(user);

            return Ok(new { message = "Password has been reset successfully." });
        }

        [HttpPost("resend-verification-email")]
        public async Task<IActionResult> ResendVerificationEmail([FromBody] ResendVerificationRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            var user = await _userService.FindByEmailAsync(request.Email);
            if (user == null || user.IsEmailVerified)
            {
                return BadRequest(new { message = "User not found or already verified." });
            }

            await _emailService.SendVerificationEmailAsync(request.Email);
            return Ok(new { message = "Verification email resent." });
        }

    }
}
