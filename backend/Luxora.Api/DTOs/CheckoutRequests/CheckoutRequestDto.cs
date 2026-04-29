namespace Luxora.Api.DTOs.CheckoutRequests;

public sealed record CheckoutRequestDto(
    string Id,
    string CustomerName,
    string Phone,
    string? Email,
    string FulfillmentPreference,
    string? Notes,
    IReadOnlyList<CheckoutRequestItemDto> Items,
    int SubtotalCents,
    string Currency,
    string Status,
    DateTime CreatedAt);
