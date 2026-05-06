namespace Luxora.Api.Services.Interfaces;

public interface IEmailService
{
    Task SendAsync(
        EmailMessage message,
        CancellationToken cancellationToken);
}

public sealed record EmailMessage(
    string To,
    string Subject,
    string HtmlBody,
    string TextBody);
