using Luxora.Api.DTOs.Auth;
using Luxora.Api.Models;
using Luxora.Api.Repositories.Interfaces;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Settings;
using Luxora.Api.Validators;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace Luxora.Api.Services;

public sealed class AdminAuthService : IAdminAuthService
{
    private readonly IAdminUserRepository _adminUserRepository;
    private readonly IPasswordHasher<AdminUser> _passwordHasher;
    private readonly AuthSettings _authSettings;

    public AdminAuthService(
        IAdminUserRepository adminUserRepository,
        IPasswordHasher<AdminUser> passwordHasher,
        IOptions<AuthSettings> authOptions)
    {
        _adminUserRepository = adminUserRepository;
        _passwordHasher = passwordHasher;
        _authSettings = authOptions.Value;
    }

    public async Task<ServiceResult<AdminMeResponseDto>> LoginAsync(
        AdminLoginRequestDto request,
        CancellationToken cancellationToken)
    {
        var errors = ValidateLoginRequest(request);
        if (errors.Count > 0)
        {
            return ServiceResult<AdminMeResponseDto>.ValidationFailure(errors);
        }

        var adminUser = await _adminUserRepository.GetByEmailAsync(
            request.Email,
            cancellationToken);

        if (adminUser is null)
        {
            return ServiceResult<AdminMeResponseDto>.ValidationFailure([
                "Invalid admin email or password."
            ]);
        }

        var now = DateTime.UtcNow;
        if (adminUser.LockoutUntil is { } lockoutUntil && lockoutUntil > now)
        {
            return ServiceResult<AdminMeResponseDto>.ValidationFailure([
                "Admin account is temporarily locked. Try again later."
            ]);
        }

        var passwordResult = _passwordHasher.VerifyHashedPassword(
            adminUser,
            adminUser.PasswordHash,
            request.Password);

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            var failedAttempts = adminUser.FailedLoginAttempts + 1;
            var newLockoutUntil = failedAttempts >= _authSettings.MaxFailedLoginAttempts
                ? now.AddMinutes(_authSettings.LockoutMinutes)
                : (DateTime?)null;

            await _adminUserRepository.RecordFailedLoginAsync(
                adminUser.Id,
                failedAttempts,
                newLockoutUntil,
                now,
                cancellationToken);

            if (newLockoutUntil is not null)
            {
                return ServiceResult<AdminMeResponseDto>.ValidationFailure([
                    "Admin account is temporarily locked. Try again later."
                ]);
            }

            return ServiceResult<AdminMeResponseDto>.ValidationFailure([
                "Invalid admin email or password."
            ]);
        }

        await _adminUserRepository.RecordSuccessfulLoginAsync(
            adminUser.Id,
            now,
            cancellationToken);

        return ServiceResult<AdminMeResponseDto>.Success(MapToMeResponse(adminUser));
    }

    public async Task<AdminMeResponseDto?> GetCurrentAdminAsync(
        ClaimsPrincipal user,
        CancellationToken cancellationToken)
    {
        var adminId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(adminId))
        {
            return null;
        }

        var adminUser = await _adminUserRepository.GetByIdAsync(
            adminId,
            cancellationToken);

        return adminUser is null ? null : MapToMeResponse(adminUser);
    }

    public async Task<ServiceResult<string>> ChangePasswordAsync(
        ClaimsPrincipal user,
        ChangeAdminPasswordRequestDto request,
        CancellationToken cancellationToken)
    {
        var adminId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(adminId))
        {
            return ServiceResult<string>.NotFound(["Admin session was not found."]);
        }

        var adminUser = await _adminUserRepository.GetByIdAsync(
            adminId,
            cancellationToken);

        if (adminUser is null)
        {
            return ServiceResult<string>.NotFound(["Admin user was not found."]);
        }

        var errors = ValidatePasswordChangeRequest(request);
        if (errors.Count > 0)
        {
            return ServiceResult<string>.ValidationFailure(errors);
        }

        var currentPasswordResult = _passwordHasher.VerifyHashedPassword(
            adminUser,
            adminUser.PasswordHash,
            request.CurrentPassword);

        if (currentPasswordResult == PasswordVerificationResult.Failed)
        {
            return ServiceResult<string>.ValidationFailure([
                "Current password is invalid."
            ]);
        }

        var passwordHash = _passwordHasher.HashPassword(
            adminUser,
            request.NewPassword);

        await _adminUserRepository.UpdatePasswordAsync(
            adminUser.Id,
            passwordHash,
            DateTime.UtcNow,
            cancellationToken);

        return ServiceResult<string>.Success("Password changed.");
    }

    private static List<string> ValidateLoginRequest(AdminLoginRequestDto request)
    {
        var errors = new List<string>();

        if (!ValidationHelper.HasValue(request.Email))
        {
            errors.Add("Email is required.");
        }

        if (!ValidationHelper.HasValue(request.Password))
        {
            errors.Add("Password is required.");
        }

        return errors;
    }

    private static List<string> ValidatePasswordChangeRequest(
        ChangeAdminPasswordRequestDto request)
    {
        var errors = new List<string>();

        if (!ValidationHelper.HasValue(request.CurrentPassword))
        {
            errors.Add("Current password is required.");
        }

        if (!ValidationHelper.HasValue(request.NewPassword))
        {
            errors.Add("New password is required.");
        }

        if (!ValidationHelper.HasValue(request.ConfirmNewPassword))
        {
            errors.Add("Confirm new password is required.");
        }

        if (ValidationHelper.HasValue(request.NewPassword)
            && request.NewPassword != request.ConfirmNewPassword)
        {
            errors.Add("New password and confirmation must match.");
        }

        if (ValidationHelper.HasValue(request.NewPassword))
        {
            if (request.NewPassword.Length < 8)
            {
                errors.Add("New password must be at least 8 characters.");
            }

            if (!Regex.IsMatch(request.NewPassword, "[A-Z]"))
            {
                errors.Add("New password must include an uppercase letter.");
            }

            if (!Regex.IsMatch(request.NewPassword, "[a-z]"))
            {
                errors.Add("New password must include a lowercase letter.");
            }

            if (!Regex.IsMatch(request.NewPassword, "[0-9]"))
            {
                errors.Add("New password must include a digit.");
            }

            if (!Regex.IsMatch(request.NewPassword, "[^a-zA-Z0-9]"))
            {
                errors.Add("New password must include a symbol.");
            }
        }

        return errors;
    }

    private static AdminMeResponseDto MapToMeResponse(AdminUser adminUser)
    {
        return new AdminMeResponseDto(
            adminUser.Id,
            adminUser.FullName,
            adminUser.Email,
            adminUser.Role);
    }
}
