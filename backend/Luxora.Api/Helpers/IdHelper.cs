namespace Luxora.Api.Helpers;

public static class IdHelper
{
    public static string NewId(string prefix)
    {
        return $"{NormalizeId(prefix)}-{Guid.NewGuid():N}";
    }

    public static string NormalizeId(string value)
    {
        return value.Trim().ToLowerInvariant().Replace(' ', '-');
    }
}
