using Luxora.Api.DTOs.Auth;
using Luxora.Api.Helpers;
using Luxora.Api.Security;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Settings;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Luxora.Api.Controllers;

[ApiController]
[Route("api/auth/admin")]
public sealed class AuthController : ControllerBase
{
    private readonly IAdminAuthService _adminAuthService;
    private readonly IWebHostEnvironment _environment;
    private readonly AuthSettings _authSettings;
    private readonly LuxoraCookieSettings _cookieSettings;

    public AuthController(
        IAdminAuthService adminAuthService,
        IWebHostEnvironment environment,
        IOptions<AuthSettings> authOptions,
        IOptions<LuxoraCookieSettings> cookieOptions)
    {
        _adminAuthService = adminAuthService;
        _environment = environment;
        _authSettings = authOptions.Value;
        _cookieSettings = cookieOptions.Value;
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
            if (IsAuthenticationFailure(result.Errors))
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
    [HttpGet("csrf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<object> GetCsrfToken()
    {
        var csrfToken = CsrfTokenHelper.GenerateToken();

        Response.Cookies.Append(
            _authSettings.CsrfCookieName,
            csrfToken,
            new CookieOptions
            {
                HttpOnly = false,
                SameSite = CookieSettingsHelper.ParseSameSite(_cookieSettings.SameSite),
                Secure = CookieSettingsHelper.ShouldUseSecureCookie(
                    _cookieSettings.SecurePolicy,
                    Request,
                    _environment),
                Path = "/"
            });

        return Ok(new { csrfToken });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        Response.Cookies.Delete(
            _authSettings.CsrfCookieName,
            new CookieOptions { Path = "/" });
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("change-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword(
        ChangeAdminPasswordRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _adminAuthService.ChangePasswordAsync(
            User,
            request,
            cancellationToken);

        if (result.IsSuccess)
        {
            return Ok(new { message = result.Value });
        }

        if (result.IsNotFound)
        {
            return Unauthorized(new { errors = result.Errors });
        }

        return BadRequest(new { errors = result.Errors });
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

    private static bool IsAuthenticationFailure(IReadOnlyList<string> errors)
    {
        return errors.Contains("Invalid admin email or password.")
            || errors.Contains("Admin account is temporarily locked. Try again later.");
    }
}
