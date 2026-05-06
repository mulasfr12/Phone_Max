namespace Luxora.Api.Services.Interfaces;

public interface IImageStorageService
{
    Task<StoredImageResult> SaveAsync(
        string productId,
        IFormFile file,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(
        string productId,
        string fileName,
        CancellationToken cancellationToken);
}

public sealed record StoredImageResult(
    string Url,
    string FileName,
    string OriginalFileName,
    string ContentType,
    long SizeBytes);
