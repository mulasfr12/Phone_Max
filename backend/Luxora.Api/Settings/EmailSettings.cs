namespace Luxora.Api.Settings;

public sealed class EmailSettings
{
    public const string SectionName = "Email";

    public string Provider { get; init; } = "Smtp";

    public string FromEmail { get; init; } = string.Empty;

    public string FromName { get; init; } = "Luxora";

    public string AdminNotificationEmail { get; init; } = string.Empty;

    public string SmtpHost { get; init; } = string.Empty;

    public int SmtpPort { get; init; } = 587;

    public string SmtpUsername { get; init; } = string.Empty;

    public string SmtpPassword { get; init; } = string.Empty;

    public bool EnableSsl { get; init; } = true;
}
