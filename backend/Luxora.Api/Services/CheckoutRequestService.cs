using Luxora.Api.Repositories.Interfaces;
using Luxora.Api.Services.Interfaces;

namespace Luxora.Api.Services;

public sealed class CheckoutRequestService : ICheckoutRequestService
{
    private readonly ICheckoutRequestRepository _checkoutRequestRepository;

    public CheckoutRequestService(ICheckoutRequestRepository checkoutRequestRepository)
    {
        _checkoutRequestRepository = checkoutRequestRepository;
    }
}
