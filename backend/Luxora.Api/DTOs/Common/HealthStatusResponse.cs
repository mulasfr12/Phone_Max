namespace Luxora.Api.DTOs.Common;

public sealed record HealthStatusResponse(
    string Status,
    string Service,
    DateTime TimestampUtc);
