using Luxora.Api.Security;
using Luxora.Api.Settings;
using Microsoft.Extensions.Options;

namespace Luxora.Api.Middleware;

public sealed class AdminCsrfMiddleware
{
    private static readonly HashSet<string> ProtectedMethods = new(StringComparer.OrdinalIgnoreCase)
    {
        HttpMethods.Post,
        HttpMethods.Put,
        HttpMethods.Patch,
        HttpMethods.Delete
    };

    private readonly RequestDelegate _next;
    private readonly AuthSettings _authSettings;

    public AdminCsrfMiddleware(
        RequestDelegate next,
        IOptions<AuthSettings> authOptions)
    {
        _next = next;
        _authSettings = authOptions.Value;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!RequiresCsrfValidation(context.Request))
        {
            await _next(context);
            return;
        }

        var cookieToken = context.Request.Cookies[_authSettings.CsrfCookieName];
        var headerToken = context.Request.Headers[CsrfTokenHelper.HeaderName].FirstOrDefault();

        if (string.IsNullOrWhiteSpace(cookieToken)
            || string.IsNullOrWhiteSpace(headerToken)
            || !string.Equals(cookieToken, headerToken, StringComparison.Ordinal))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsJsonAsync(new
            {
                errors = new[] { "Invalid admin request verification token." }
            });
            return;
        }

        await _next(context);
    }

    private static bool RequiresCsrfValidation(HttpRequest request)
    {
        var isProtectedAdminPath =
            request.Path.StartsWithSegments("/api/admin", StringComparison.OrdinalIgnoreCase)
            || request.Path.Equals(
                "/api/auth/admin/change-password",
                StringComparison.OrdinalIgnoreCase);

        return isProtectedAdminPath
            && ProtectedMethods.Contains(request.Method);
    }
}
