using Luxora.Api.Security;

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

    public AdminCsrfMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!RequiresCsrfValidation(context.Request))
        {
            await _next(context);
            return;
        }

        var cookieToken = context.Request.Cookies[CsrfTokenHelper.CookieName];
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
        return request.Path.StartsWithSegments("/api/admin", StringComparison.OrdinalIgnoreCase)
            && ProtectedMethods.Contains(request.Method);
    }
}
