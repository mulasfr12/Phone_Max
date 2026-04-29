namespace Luxora.Api.Validators;

public static class ValidationHelper
{
    public static bool HasValue(string? value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }

    public static bool IsPositive(int value)
    {
        return value > 0;
    }
}
