using Luxora.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Api.Controllers;

[ApiController]
[Route("api/dev/seed")]
public sealed class DevSeedController : ControllerBase
{
    private readonly DatabaseSeeder _databaseSeeder;
    private readonly IWebHostEnvironment _environment;

    public DevSeedController(
        DatabaseSeeder databaseSeeder,
        IWebHostEnvironment environment)
    {
        _databaseSeeder = databaseSeeder;
        _environment = environment;
    }

    [HttpPost]
    [ProducesResponseType(typeof(SeedResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SeedResult>> Seed(CancellationToken cancellationToken)
    {
        if (!_environment.IsDevelopment())
        {
            return NotFound();
        }

        var result = await _databaseSeeder.SeedAsync(cancellationToken);
        return Ok(result);
    }
}
