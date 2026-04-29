namespace Luxora.Api.DTOs.CheckoutRequests;

public sealed record CreateCheckoutRequestItemDto(
    string ProductId,
    int Quantity);
