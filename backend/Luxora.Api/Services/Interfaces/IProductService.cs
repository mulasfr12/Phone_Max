using Luxora.Api.DTOs.Products;
using Luxora.Api.Services;

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

    Task<ServiceResult<ProductDto>> CreateAsync(
        CreateProductDto request,
        CancellationToken cancellationToken);

    Task<ServiceResult<ProductDto>> UpdateAsync(
        string id,
        UpdateProductDto request,
        CancellationToken cancellationToken);

    Task<ServiceResult<bool>> DeleteAsync(string id, CancellationToken cancellationToken);
}
