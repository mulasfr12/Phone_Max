namespace Luxora.Api.DTOs.CheckoutRequests;

public sealed record CreateCheckoutRequestDto(
    string CustomerName,
    string Phone,
    string? Email,
    string FulfillmentPreference,
    string PaymentMethod,
    string? Notes,
    List<CreateCheckoutRequestItemDto> Items);
