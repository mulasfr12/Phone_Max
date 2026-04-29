using Luxora.Api.DTOs.Auth;
using Luxora.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Luxora.Api.Controllers;

[ApiController]
[Route("api/auth/admin")]
public sealed class AuthController : ControllerBase
{
    private readonly IAdminAuthService _adminAuthService;

    public AuthController(IAdminAuthService adminAuthService)
    {
        _adminAuthService = adminAuthService;
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AdminAuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AdminAuthResponseDto>> Login(
        AdminLoginRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _adminAuthService.LoginAsync(request, cancellationToken);

        if (!result.IsSuccess)
        {
            if (result.Errors.Contains("Invalid admin email or password."))
            {
                return Unauthorized(new { errors = result.Errors });
            }

            return BadRequest(new { errors = result.Errors });
        }

        var admin = result.Value!;
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, admin.Id),
            new(ClaimTypes.Name, admin.FullName),
            new(ClaimTypes.Email, admin.Email),
            new(ClaimTypes.Role, admin.Role)
        };

        var identity = new ClaimsIdentity(
            claims,
            CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties
            {
                IsPersistent = true,
                IssuedUtc = DateTimeOffset.UtcNow
            });

        return Ok(new AdminAuthResponseDto(admin));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("me")]
    [ProducesResponseType(typeof(AdminMeResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AdminMeResponseDto>> Me(
        CancellationToken cancellationToken)
    {
        var admin = await _adminAuthService.GetCurrentAdminAsync(
            User,
            cancellationToken);

        if (admin is null)
        {
            return Unauthorized();
        }

        return Ok(admin);
    }
}
