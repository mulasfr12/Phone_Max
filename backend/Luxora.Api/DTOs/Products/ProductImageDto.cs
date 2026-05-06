namespace Luxora.Api.DTOs.Products;

public sealed record ProductImageDto(
    string Id,
    string Url,
    string FileName,
    string OriginalFileName,
    string ContentType,
    long SizeBytes,
    string? AltText,
    bool IsPrimary,
    DateTime UploadedAt);
