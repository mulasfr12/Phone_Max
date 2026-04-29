using MongoDB.Bson.Serialization.Attributes;

namespace Luxora.Api.Models;

public sealed class CheckoutRequest
{
    [BsonId]
    public string Id { get; set; } = string.Empty;

    public string CustomerName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string FulfillmentPreference { get; set; } = string.Empty;

    public string? Notes { get; set; }

    public List<CheckoutRequestItem> Items { get; set; } = [];

    public int SubtotalCents { get; set; }

    public string Currency { get; set; } = "USD";

    public string Status { get; set; } = "pending";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}
