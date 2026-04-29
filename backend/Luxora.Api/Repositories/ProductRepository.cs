using Luxora.Api.Data;
using Luxora.Api.Repositories.Interfaces;

namespace Luxora.Api.Repositories;

public sealed class ProductRepository : IProductRepository
{
    private readonly MongoDbContext _context;

    public ProductRepository(MongoDbContext context)
    {
        _context = context;
    }
}
