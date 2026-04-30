namespace Luxora.Api.Settings;

public sealed class FrontendSettings
{
    public const string SectionName = "Frontend";

    public string[] AllowedOrigins { get; init; } =
    [
        "http://localhost:5173",
        "https://localhost:5173"
    ];
}
