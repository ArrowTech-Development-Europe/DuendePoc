using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("identity")]
[ApiController]
public class IdentityController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var claims = User.Claims.Select(c => new { c.Type, c.Value });
        return Ok(new
        {
            Message = "You are authenticated!",
            User = User.Identity?.Name,
            Claims = claims
        });
    }
}
