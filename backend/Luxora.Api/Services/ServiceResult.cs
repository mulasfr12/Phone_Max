namespace Luxora.Api.Services;

public sealed record ServiceResult<T>(
    bool IsSuccess,
    T? Value,
    IReadOnlyList<string> Errors,
    bool IsNotFound = false)
{
    public static ServiceResult<T> Success(T value)
    {
        return new ServiceResult<T>(true, value, []);
    }

    public static ServiceResult<T> ValidationFailure(IReadOnlyList<string> errors)
    {
        return new ServiceResult<T>(false, default, errors);
    }

    public static ServiceResult<T> NotFound(IReadOnlyList<string> errors)
    {
        return new ServiceResult<T>(false, default, errors, true);
    }
}
