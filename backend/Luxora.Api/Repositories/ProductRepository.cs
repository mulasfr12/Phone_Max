using Luxora.Api.Data;
using Luxora.Api.Models;
using Luxora.Api.Repositories.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.RegularExpressions;

namespace Luxora.Api.Repositories;

public sealed class ProductRepository : IProductRepository
{
    private readonly MongoDbContext _context;

    public ProductRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Product>> GetAllAsync(
        string? categoryId,
        string? categoryName,
        bool? inStock,
        string? search,
        CancellationToken cancellationToken)
    {
        var filterBuilder = Builders<Product>.Filter;
        var filters = new List<FilterDefinition<Product>>();

        if (!string.IsNullOrWhiteSpace(categoryId))
        {
            filters.Add(filterBuilder.Eq(product => product.CategoryId, categoryId.Trim()));
        }

        if (!string.IsNullOrWhiteSpace(categoryName))
        {
            filters.Add(filterBuilder.Eq(product => product.CategoryName, categoryName.Trim()));
        }

        if (inStock.HasValue)
        {
            filters.Add(filterBuilder.Eq(product => product.InStock, inStock.Value));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchRegex = new BsonRegularExpression(
                Regex.Escape(search.Trim()),
                "i");
            filters.Add(filterBuilder.Or(
                filterBuilder.Regex(product => product.Name, searchRegex),
                filterBuilder.Regex(product => product.Spec, searchRegex),
                filterBuilder.Regex(product => product.Finish, searchRegex),
                filterBuilder.Regex(product => product.ShortDescription, searchRegex)));
        }

        var filter = filters.Count > 0
            ? filterBuilder.And(filters)
            : filterBuilder.Empty;

        return await _context.Products
            .Find(filter)
            .SortBy(product => product.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Product?> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        return await _context.Products
            .Find(product => product.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task CreateAsync(Product product, CancellationToken cancellationToken)
    {
        await _context.Products.InsertOneAsync(
            product,
            cancellationToken: cancellationToken);
    }

    public async Task<Product?> UpdateAsync(Product product, CancellationToken cancellationToken)
    {
        var result = await _context.Products.ReplaceOneAsync(
            existingProduct => existingProduct.Id == product.Id,
            product,
            new ReplaceOptions(),
            cancellationToken);

        return result.MatchedCount == 0
            ? null
            : product;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken)
    {
        var result = await _context.Products.DeleteOneAsync(
            product => product.Id == id,
            cancellationToken);

        return result.DeletedCount > 0;
    }
}
