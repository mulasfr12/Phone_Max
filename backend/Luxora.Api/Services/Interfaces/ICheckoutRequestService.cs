using Luxora.Api.DTOs.CheckoutRequests;

namespace Luxora.Api.Services.Interfaces;

public interface ICheckoutRequestService
{
    Task<IReadOnlyList<CheckoutRequestDto>> GetAllAsync(
        string? status,
        string? paymentStatus,
        string? fulfillmentPreference,
        string? paymentMethod,
        CancellationToken cancellationToken);

    Task<CheckoutRequestDto?> GetByIdAsync(string id, CancellationToken cancellationToken);

    Task<ServiceResult<CheckoutRequestDto>> CreateAsync(
        CreateCheckoutRequestDto request,
        CancellationToken cancellationToken);

    Task<ServiceResult<CheckoutRequestDto>> UpdateStatusAsync(
        string id,
        UpdateCheckoutRequestStatusDto request,
        CancellationToken cancellationToken);

    Task<ServiceResult<CheckoutRequestDto>> UpdatePaymentStatusAsync(
        string id,
        UpdateCheckoutPaymentStatusDto request,
        CancellationToken cancellationToken);
}
