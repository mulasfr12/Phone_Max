namespace Luxora.Api.Helpers;

public static class IdHelper
{
    public static string NormalizeId(string value)
    {
        return value.Trim().ToLowerInvariant().Replace(' ', '-');
    }
}
