namespace Luxora.Api.Settings;

public sealed class LuxoraCookieSettings
{
    public const string SectionName = "Cookie";

    public string SameSite { get; init; } = "Lax";

    public string SecurePolicy { get; init; } = "Always";
}
