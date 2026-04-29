using Luxora.Api.DTOs.Products;

namespace Luxora.Api.Services.Interfaces;

public interface IProductService
{
    Task<IReadOnlyList<ProductDto>> GetAllAsync(
        string? categoryId,
        string? categoryName,
        bool? inStock,
        string? search,
        CancellationToken cancellationToken);

    Task<ProductDto?> GetByIdAsync(string id, CancellationToken cancellationToken);
}
