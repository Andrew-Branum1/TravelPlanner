using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TravelPlanner.Server.Controllers
{
    [ApiController]
    [Route("api/protected")]
    [Authorize]
    public class ProtectedController : ControllerBase
    {
        [HttpGet("user-info")]
        public IActionResult GetUserInfo()
        {
            var username = User.Identity?.Name;
            return Ok(new { Username = username });
        }
    }

}
