using System.Net;
using System.Net.Mail;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Settings;
using Luxora.Api.Validators;
using Microsoft.Extensions.Options;

namespace Luxora.Api.Services;

public sealed class SmtpEmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public SmtpEmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendAsync(
        EmailMessage message,
        CancellationToken cancellationToken)
    {
        ValidateSettings(message);

        using var mailMessage = new MailMessage
        {
            From = new MailAddress(_settings.FromEmail, _settings.FromName),
            Subject = message.Subject,
            Body = message.HtmlBody,
            IsBodyHtml = true
        };
        mailMessage.To.Add(message.To);
        mailMessage.AlternateViews.Add(
            AlternateView.CreateAlternateViewFromString(
                message.TextBody,
                null,
                "text/plain"));

        using var smtpClient = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
        {
            EnableSsl = _settings.EnableSsl
        };

        if (ValidationHelper.HasValue(_settings.SmtpUsername))
        {
            smtpClient.Credentials = new NetworkCredential(
                _settings.SmtpUsername,
                _settings.SmtpPassword);
        }

        await smtpClient.SendMailAsync(mailMessage, cancellationToken);
    }

    private void ValidateSettings(EmailMessage message)
    {
        if (!ValidationHelper.HasValue(message.To)
            || !ValidationHelper.HasValue(message.Subject)
            || !ValidationHelper.HasValue(message.HtmlBody)
            || !ValidationHelper.HasValue(message.TextBody)
            || !ValidationHelper.HasValue(_settings.FromEmail)
            || !ValidationHelper.HasValue(_settings.AdminNotificationEmail)
            || !ValidationHelper.HasValue(_settings.SmtpHost))
        {
            throw new InvalidOperationException(
                "Email notification settings are not configured.");
        }
    }
}
