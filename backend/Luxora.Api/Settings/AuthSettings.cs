namespace Luxora.Api.Settings;

public sealed class AuthSettings
{
    public const string SectionName = "Auth";

    public string AdminCookieName { get; init; } = "Luxora.AdminAuth";

    public string CsrfCookieName { get; init; } = "Luxora.Csrf";

    public int MaxFailedLoginAttempts { get; init; } = 5;

    public int LockoutMinutes { get; init; } = 15;
}
