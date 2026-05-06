using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Luxora.Api.Helpers;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Settings;
using Luxora.Api.Validators;
using Microsoft.Extensions.Options;

namespace Luxora.Api.Services;

public sealed class AzureBlobImageStorageService : IImageStorageService
{
    private static readonly Dictionary<string, string> ExtensionByContentType = new(
        StringComparer.OrdinalIgnoreCase)
    {
        ["image/jpeg"] = ".jpg",
        ["image/png"] = ".png",
        ["image/webp"] = ".webp"
    };

    private readonly ImageStorageSettings _settings;

    public AzureBlobImageStorageService(IOptions<ImageStorageSettings> options)
    {
        _settings = options.Value;
    }

    public async Task<StoredImageResult> SaveAsync(
        string productId,
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            throw new InvalidOperationException("Image file is required.");
        }

        if (file.Length > _settings.MaxFileSizeBytes)
        {
            throw new InvalidOperationException("Image file is too large.");
        }

        if (!_settings.AllowedContentTypes.Contains(
            file.ContentType,
            StringComparer.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Image file type is not supported.");
        }

        var blobName = CreateBlobName(productId, file.ContentType);
        var containerClient = CreateContainerClient();
        await containerClient.CreateIfNotExistsAsync(
            cancellationToken: cancellationToken);

        var blobClient = containerClient.GetBlobClient(blobName);
        await using var stream = file.OpenReadStream();

        await blobClient.UploadAsync(
            stream,
            new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders
                {
                    ContentType = file.ContentType
                }
            },
            cancellationToken);

        return new StoredImageResult(
            BuildPublicUrl(blobClient, blobName),
            blobName,
            Path.GetFileName(file.FileName),
            file.ContentType,
            file.Length);
    }

    public async Task<bool> DeleteAsync(
        string productId,
        string fileName,
        CancellationToken cancellationToken)
    {
        if (!ValidationHelper.HasValue(fileName))
        {
            return true;
        }

        var safeBlobName = fileName.Trim().Replace('\\', '/');
        var expectedPrefix = $"products/{IdHelper.NormalizeId(productId)}/";

        if (safeBlobName.Contains("..", StringComparison.Ordinal)
            || !safeBlobName.StartsWith(expectedPrefix, StringComparison.Ordinal))
        {
            return false;
        }

        var blobClient = CreateContainerClient().GetBlobClient(safeBlobName);
        await blobClient.DeleteIfExistsAsync(cancellationToken: cancellationToken);
        return true;
    }

    private BlobContainerClient CreateContainerClient()
    {
        if (!ValidationHelper.HasValue(_settings.ConnectionString))
        {
            throw new InvalidOperationException(
                "Azure Blob image storage requires ImageStorage:ConnectionString.");
        }

        if (!ValidationHelper.HasValue(_settings.ContainerName))
        {
            throw new InvalidOperationException(
                "Azure Blob image storage requires ImageStorage:ContainerName.");
        }

        return new BlobContainerClient(
            _settings.ConnectionString,
            _settings.ContainerName);
    }

    private static string CreateBlobName(string productId, string contentType)
    {
        var extension = ExtensionByContentType.TryGetValue(
            contentType,
            out var mappedExtension)
            ? mappedExtension
            : ".bin";
        var safeProductId = IdHelper.NormalizeId(productId);

        return $"products/{safeProductId}/{Guid.NewGuid():N}{extension}";
    }

    private string BuildPublicUrl(BlobClient blobClient, string blobName)
    {
        if (!ValidationHelper.HasValue(_settings.PublicBaseUrl))
        {
            return blobClient.Uri.ToString();
        }

        return $"{_settings.PublicBaseUrl!.TrimEnd('/')}/{blobName}";
    }
}
