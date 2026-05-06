namespace Luxora.Api.Validators;

public static class ImageFileValidator
{
    private static readonly byte[] JpegSignature = [0xFF, 0xD8, 0xFF];
    private static readonly byte[] PngSignature =
    [
        0x89, 0x50, 0x4E, 0x47,
        0x0D, 0x0A, 0x1A, 0x0A
    ];
    private static readonly byte[] WebpRiffSignature = [0x52, 0x49, 0x46, 0x46];
    private static readonly byte[] WebpFormatSignature = [0x57, 0x45, 0x42, 0x50];

    public static async Task<bool> MatchesContentTypeAsync(
        IFormFile file,
        string contentType,
        CancellationToken cancellationToken)
    {
        var header = new byte[12];
        await using var stream = file.OpenReadStream();
        var bytesRead = await stream.ReadAsync(header, cancellationToken);

        return contentType.Trim().ToLowerInvariant() switch
        {
            "image/jpeg" => StartsWith(header, bytesRead, JpegSignature),
            "image/png" => StartsWith(header, bytesRead, PngSignature),
            "image/webp" => StartsWith(header, bytesRead, WebpRiffSignature)
                && HasSignatureAt(header, bytesRead, WebpFormatSignature, 8),
            _ => false
        };
    }

    private static bool StartsWith(byte[] value, int bytesRead, byte[] signature)
    {
        return HasSignatureAt(value, bytesRead, signature, 0);
    }

    private static bool HasSignatureAt(
        byte[] value,
        int bytesRead,
        byte[] signature,
        int offset)
    {
        if (bytesRead < offset + signature.Length)
        {
            return false;
        }

        for (var index = 0; index < signature.Length; index++)
        {
            if (value[offset + index] != signature[index])
            {
                return false;
            }
        }

        return true;
    }
}
