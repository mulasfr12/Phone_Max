using Luxora.Api.DTOs.Auth;
using Luxora.Api.Models;
using Luxora.Api.Repositories.Interfaces;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Validators;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Luxora.Api.Services;

public sealed class AdminAuthService : IAdminAuthService
{
    private readonly IAdminUserRepository _adminUserRepository;
    private readonly IPasswordHasher<AdminUser> _passwordHasher;

    public AdminAuthService(
        IAdminUserRepository adminUserRepository,
        IPasswordHasher<AdminUser> passwordHasher)
    {
        _adminUserRepository = adminUserRepository;
        _passwordHasher = passwordHasher;
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

        var passwordResult = _passwordHasher.VerifyHashedPassword(
            adminUser,
            adminUser.PasswordHash,
            request.Password);

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return ServiceResult<AdminMeResponseDto>.ValidationFailure([
                "Invalid admin email or password."
            ]);
        }

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

    private static AdminMeResponseDto MapToMeResponse(AdminUser adminUser)
    {
        return new AdminMeResponseDto(
            adminUser.Id,
            adminUser.FullName,
            adminUser.Email,
            adminUser.Role);
    }
}
