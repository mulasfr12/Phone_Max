using Luxora.Api.DTOs.Common;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HealthController : ControllerBase
{
    [HttpGet]
    public ActionResult<HealthStatusResponse> Get()
    {
        return Ok(new HealthStatusResponse(
            Status: "ok",
            Service: "Luxora.Api",
            TimestampUtc: DateTime.UtcNow));
    }
}
