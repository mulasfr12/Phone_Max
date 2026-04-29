using Luxora.Api.Models;

namespace Luxora.Api.Repositories.Interfaces;

public interface IProductRepository
{
    Task<IReadOnlyList<Product>> GetAllAsync(
        string? categoryId,
        string? categoryName,
        bool? inStock,
        string? search,
        CancellationToken cancellationToken);

    Task<Product?> GetByIdAsync(string id, CancellationToken cancellationToken);
}
