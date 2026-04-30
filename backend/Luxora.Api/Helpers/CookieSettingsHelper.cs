namespace Luxora.Api.Helpers;

public static class CookieSettingsHelper
{
    public static SameSiteMode ParseSameSite(string? value)
    {
        return value?.Trim().ToLowerInvariant() switch
        {
            "none" => SameSiteMode.None,
            "strict" => SameSiteMode.Strict,
            "lax" => SameSiteMode.Lax,
            _ => SameSiteMode.Lax
        };
    }

    public static CookieSecurePolicy ParseSecurePolicy(string? value)
    {
        return value?.Trim().ToLowerInvariant() switch
        {
            "always" => CookieSecurePolicy.Always,
            "none" => CookieSecurePolicy.None,
            "sameasrequest" => CookieSecurePolicy.SameAsRequest,
            _ => CookieSecurePolicy.SameAsRequest
        };
    }

    public static bool ShouldUseSecureCookie(
        string? securePolicy,
        HttpRequest request,
        IWebHostEnvironment environment)
    {
        return ParseSecurePolicy(securePolicy) switch
        {
            CookieSecurePolicy.Always => true,
            CookieSecurePolicy.None => false,
            CookieSecurePolicy.SameAsRequest => request.IsHttps,
            _ => !environment.IsDevelopment()
        };
    }
}
