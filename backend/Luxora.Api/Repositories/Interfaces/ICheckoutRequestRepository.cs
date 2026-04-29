using Luxora.Api.Models;

namespace Luxora.Api.Repositories.Interfaces;

public interface ICheckoutRequestRepository
{
    Task<IReadOnlyList<CheckoutRequest>> GetAllAsync(
        string? status,
        string? paymentStatus,
        string? fulfillmentPreference,
        string? paymentMethod,
        CancellationToken cancellationToken);

    Task CreateAsync(CheckoutRequest checkoutRequest, CancellationToken cancellationToken);

    Task<CheckoutRequest?> GetByIdAsync(string id, CancellationToken cancellationToken);

    Task<CheckoutRequest?> UpdateStatusAsync(
        string id,
        string status,
        DateTime updatedAt,
        CancellationToken cancellationToken);

    Task<CheckoutRequest?> UpdatePaymentStatusAsync(
        string id,
        string paymentStatus,
        DateTime updatedAt,
        CancellationToken cancellationToken);
}
