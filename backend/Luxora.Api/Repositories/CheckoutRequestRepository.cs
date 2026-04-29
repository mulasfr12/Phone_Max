using Luxora.Api.Data;
using Luxora.Api.Repositories.Interfaces;

namespace Luxora.Api.Repositories;

public sealed class CheckoutRequestRepository : ICheckoutRequestRepository
{
    private readonly MongoDbContext _context;

    public CheckoutRequestRepository(MongoDbContext context)
    {
        _context = context;
    }
}
