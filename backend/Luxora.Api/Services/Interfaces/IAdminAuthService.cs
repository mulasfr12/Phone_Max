using Luxora.Api.DTOs.Auth;
using System.Security.Claims;

namespace Luxora.Api.Services.Interfaces;

public interface IAdminAuthService
{
    Task<ServiceResult<AdminMeResponseDto>> LoginAsync(
        AdminLoginRequestDto request,
        CancellationToken cancellationToken);

    Task<AdminMeResponseDto?> GetCurrentAdminAsync(
        ClaimsPrincipal user,
        CancellationToken cancellationToken);
}
