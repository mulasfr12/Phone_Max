namespace Luxora.Api.DTOs.Auth;

public sealed record AdminLoginRequestDto(
    string Email,
    string Password);
