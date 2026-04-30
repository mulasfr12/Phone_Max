namespace Luxora.Api.DTOs.Auth;

public sealed record ChangeAdminPasswordRequestDto(
    string CurrentPassword,
    string NewPassword,
    string ConfirmNewPassword);
