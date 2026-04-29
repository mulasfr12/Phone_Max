using Luxora.Api.Data;
using Luxora.Api.Models;
using Luxora.Api.Repositories.Interfaces;
using MongoDB.Driver;

namespace Luxora.Api.Repositories;

public sealed class CategoryRepository : ICategoryRepository
{
    private readonly MongoDbContext _context;

    public CategoryRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Categories
            .Find(Builders<Category>.Filter.Empty)
            .SortBy(category => category.SortOrder)
            .ThenBy(category => category.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Category?> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .Find(category => category.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task CreateAsync(Category category, CancellationToken cancellationToken)
    {
        await _context.Categories.InsertOneAsync(
            category,
            cancellationToken: cancellationToken);
    }

    public async Task<Category?> UpdateAsync(Category category, CancellationToken cancellationToken)
    {
        var result = await _context.Categories.ReplaceOneAsync(
            existingCategory => existingCategory.Id == category.Id,
            category,
            new ReplaceOptions(),
            cancellationToken);

        return result.MatchedCount == 0
            ? null
            : category;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken)
    {
        var result = await _context.Categories.DeleteOneAsync(
            category => category.Id == id,
            cancellationToken);

        return result.DeletedCount > 0;
    }
}
