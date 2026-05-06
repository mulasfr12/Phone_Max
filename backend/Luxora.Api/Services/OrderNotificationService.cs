using System.Globalization;
using System.Net;
using System.Text;
using Luxora.Api.Models;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Settings;
using Luxora.Api.Validators;
using Microsoft.Extensions.Options;

namespace Luxora.Api.Services;

public sealed class OrderNotificationService : IOrderNotificationService
{
    private readonly IEmailService _emailService;
    private readonly EmailSettings _settings;

    public OrderNotificationService(
        IEmailService emailService,
        IOptions<EmailSettings> options)
    {
        _emailService = emailService;
        _settings = options.Value;
    }

    public async Task SendCheckoutRequestCreatedAsync(
        CheckoutRequest checkoutRequest,
        CancellationToken cancellationToken)
    {
        var subject = $"New Luxora checkout request {checkoutRequest.Id}";
        var textBody = BuildTextBody(checkoutRequest);
        var htmlBody = BuildHtmlBody(checkoutRequest);

        await _emailService.SendAsync(
            new EmailMessage(
                _settings.AdminNotificationEmail,
                subject,
                htmlBody,
                textBody),
            cancellationToken);
    }

    private static string BuildTextBody(CheckoutRequest checkoutRequest)
    {
        var builder = new StringBuilder();
        builder.AppendLine("New Luxora checkout request");
        builder.AppendLine();
        builder.AppendLine($"Request: {checkoutRequest.Id}");
        builder.AppendLine($"Customer: {checkoutRequest.CustomerName}");
        builder.AppendLine($"Phone: {checkoutRequest.Phone}");

        if (ValidationHelper.HasValue(checkoutRequest.Email))
        {
            builder.AppendLine($"Email: {checkoutRequest.Email}");
        }

        builder.AppendLine($"Fulfillment: {checkoutRequest.FulfillmentPreference}");
        builder.AppendLine($"Payment method: {checkoutRequest.PaymentMethod}");
        builder.AppendLine($"Payment status: {checkoutRequest.PaymentStatus}");
        builder.AppendLine($"Order status: {checkoutRequest.Status}");
        builder.AppendLine($"Created: {checkoutRequest.CreatedAt:u}");
        builder.AppendLine();
        builder.AppendLine("Items:");

        foreach (var item in checkoutRequest.Items)
        {
            builder.AppendLine(
                $"- {item.ProductName} x {item.Quantity} @ {FormatMoney(item.UnitPriceCents, checkoutRequest.Currency)}");
        }

        builder.AppendLine();
        builder.AppendLine($"Subtotal: {FormatMoney(checkoutRequest.SubtotalCents, checkoutRequest.Currency)}");

        if (ValidationHelper.HasValue(checkoutRequest.Notes))
        {
            builder.AppendLine();
            builder.AppendLine("Notes:");
            builder.AppendLine(checkoutRequest.Notes);
        }

        return builder.ToString();
    }

    private static string BuildHtmlBody(CheckoutRequest checkoutRequest)
    {
        var itemRows = string.Join(
            "",
            checkoutRequest.Items.Select(item => $"""
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;">{HtmlEncode(item.ProductName)}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;text-align:center;">{item.Quantity}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;text-align:right;">{HtmlEncode(FormatMoney(item.UnitPriceCents, checkoutRequest.Currency))}</td>
                </tr>
                """));

        var customerEmail = ValidationHelper.HasValue(checkoutRequest.Email)
            ? $"<p><strong>Email:</strong> {HtmlEncode(checkoutRequest.Email!)}</p>"
            : string.Empty;
        var notes = ValidationHelper.HasValue(checkoutRequest.Notes)
            ? $"<h2 style=\"font-size:16px;\">Notes</h2><p>{HtmlEncode(checkoutRequest.Notes!)}</p>"
            : string.Empty;

        return $"""
            <!doctype html>
            <html>
            <body style="margin:0;background:#f4f4f5;color:#18181b;font-family:Arial,sans-serif;">
              <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
                <div style="background:#ffffff;border:1px solid #e4e4e7;padding:28px;">
                  <p style="margin:0 0 8px;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;">Luxora checkout request</p>
                  <h1 style="margin:0 0 20px;font-size:24px;">New order request</h1>
                  <p><strong>Request:</strong> {HtmlEncode(checkoutRequest.Id)}</p>
                  <p><strong>Customer:</strong> {HtmlEncode(checkoutRequest.CustomerName)}</p>
                  <p><strong>Phone:</strong> {HtmlEncode(checkoutRequest.Phone)}</p>
                  {customerEmail}
                  <p><strong>Fulfillment:</strong> {HtmlEncode(checkoutRequest.FulfillmentPreference)}</p>
                  <p><strong>Payment method:</strong> {HtmlEncode(checkoutRequest.PaymentMethod)}</p>
                  <p><strong>Payment status:</strong> {HtmlEncode(checkoutRequest.PaymentStatus)}</p>
                  <p><strong>Order status:</strong> {HtmlEncode(checkoutRequest.Status)}</p>
                  <p><strong>Created:</strong> {HtmlEncode(checkoutRequest.CreatedAt.ToString("u", CultureInfo.InvariantCulture))}</p>

                  <h2 style="font-size:16px;margin-top:28px;">Items</h2>
                  <table style="width:100%;border-collapse:collapse;">
                    <thead>
                      <tr>
                        <th style="text-align:left;padding:8px 0;border-bottom:1px solid #a1a1aa;">Product</th>
                        <th style="text-align:center;padding:8px 0;border-bottom:1px solid #a1a1aa;">Qty</th>
                        <th style="text-align:right;padding:8px 0;border-bottom:1px solid #a1a1aa;">Unit</th>
                      </tr>
                    </thead>
                    <tbody>{itemRows}</tbody>
                  </table>
                  <p style="font-size:18px;"><strong>Subtotal:</strong> {HtmlEncode(FormatMoney(checkoutRequest.SubtotalCents, checkoutRequest.Currency))}</p>
                  {notes}
                </div>
              </div>
            </body>
            </html>
            """;
    }

    private static string FormatMoney(int cents, string currency)
    {
        return string.Create(
            CultureInfo.InvariantCulture,
            $"{currency.ToUpperInvariant()} {cents / 100m:N2}");
    }

    private static string HtmlEncode(string value)
    {
        return WebUtility.HtmlEncode(value);
    }
}
