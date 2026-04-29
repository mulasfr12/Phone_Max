using MongoDB.Bson.Serialization.Attributes;

namespace Luxora.Api.Models;

public sealed class Product
{
    [BsonId]
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string CategoryId { get; set; } = string.Empty;

    public string CategoryName { get; set; } = string.Empty;

    public string Finish { get; set; } = string.Empty;

    public string Spec { get; set; } = string.Empty;

    public string ShortDescription { get; set; } = string.Empty;

    public List<string> Features { get; set; } = [];

    public int PriceCents { get; set; }

    public string Currency { get; set; } = "USD";

    public bool InStock { get; set; }

    public string StockStatus { get; set; } = string.Empty;

    public string Visual { get; set; } = string.Empty;

    public string Tone { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}
