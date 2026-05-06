namespace Luxora.Api.Settings;

public sealed class ImageStorageSettings
{
    public const string SectionName = "ImageStorage";

    public string Provider { get; init; } = "AzureBlob";

    public string ConnectionString { get; init; } = string.Empty;

    public string ContainerName { get; init; } = "product-images";

    public string? PublicBaseUrl { get; init; }

    public long MaxFileSizeBytes { get; init; } = 5_242_880;

    public string[] AllowedContentTypes { get; init; } =
    [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];
}
