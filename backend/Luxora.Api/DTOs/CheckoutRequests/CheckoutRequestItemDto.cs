namespace Luxora.Api.DTOs.CheckoutRequests;

public sealed record CheckoutRequestItemDto(
    string ProductId,
    int Quantity,
    int UnitPriceCents,
    string ProductName);
