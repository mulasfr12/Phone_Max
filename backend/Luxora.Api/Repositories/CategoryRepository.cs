using Luxora.Api.Data;
using Luxora.Api.Repositories.Interfaces;

namespace Luxora.Api.Repositories;

public sealed class CategoryRepository : ICategoryRepository
{
    private readonly MongoDbContext _context;

    public CategoryRepository(MongoDbContext context)
    {
        _context = context;
    }
}
