namespace Luxora.Api.DTOs.Auth;

public sealed record AdminMeResponseDto(
    string Id,
    string FullName,
    string Email,
    string Role);
