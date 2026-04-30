using System.Security.Cryptography;

namespace Luxora.Api.Security;

public static class CsrfTokenHelper
{
    public const string HeaderName = "X-CSRF-TOKEN";

    public static string GenerateToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    }
}
