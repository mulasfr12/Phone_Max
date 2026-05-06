namespace Luxora.Api.Models;

public sealed class ProductImage
{
    public string Id { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;

    public string FileName { get; set; } = string.Empty;

    public string OriginalFileName { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;

    public long SizeBytes { get; set; }

    public string? AltText { get; set; }

    public bool IsPrimary { get; set; }

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
