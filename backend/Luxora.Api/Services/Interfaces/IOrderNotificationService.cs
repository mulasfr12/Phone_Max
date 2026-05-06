using Luxora.Api.Models;

namespace Luxora.Api.Services.Interfaces;

public interface IOrderNotificationService
{
    Task SendCheckoutRequestCreatedAsync(
        CheckoutRequest checkoutRequest,
        CancellationToken cancellationToken);
}
