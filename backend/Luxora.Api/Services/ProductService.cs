using Luxora.Api.DTOs.Products;
using Luxora.Api.Models;
using Luxora.Api.Repositories.Interfaces;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Helpers;
using Luxora.Api.Validators;

namespace Luxora.Api.Services;

public sealed class ProductService : IProductService
{
    private static readonly string[] AllowedStockStatuses = [
        "in_stock",
        "low_stock",
        "waitlist",
        "out_of_stock"
    ];

    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<IReadOnlyList<ProductDto>> GetAllAsync(
        string? categoryId,
        string? categoryName,
        bool? inStock,
        string? search,
        CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetAllAsync(
            categoryId,
            categoryName,
            inStock,
            search,
            cancellationToken);

        return products.Select(MapToDto).ToList();
    }

    public async Task<ProductDto?> GetByIdAsync(
        string id,
        CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        return product is null ? null : MapToDto(product);
    }

    public async Task<ServiceResult<ProductDto>> CreateAsync(
        CreateProductDto request,
        CancellationToken cancellationToken)
    {
        var errors = ValidateProductRequest(
            request.Name,
            request.CategoryId,
            request.CategoryName,
            request.PriceCents,
            request.Currency,
            request.StockStatus);

        if (errors.Count > 0)
        {
            return ServiceResult<ProductDto>.ValidationFailure(errors);
        }

        var product = new Product
        {
            Id = IdHelper.NormalizeId(request.Name),
            Name = request.Name.Trim(),
            CategoryId = request.CategoryId.Trim(),
            CategoryName = request.CategoryName.Trim(),
            Finish = request.Finish?.Trim() ?? string.Empty,
            Spec = request.Spec?.Trim() ?? string.Empty,
            ShortDescription = request.ShortDescription?.Trim() ?? string.Empty,
            Features = NormalizeFeatures(request.Features),
            PriceCents = request.PriceCents,
            Currency = request.Currency.Trim().ToUpperInvariant(),
            InStock = request.InStock,
            StockStatus = request.StockStatus.Trim().ToLowerInvariant(),
            Visual = request.Visual?.Trim() ?? string.Empty,
            Tone = request.Tone?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        await _productRepository.CreateAsync(product, cancellationToken);

        return ServiceResult<ProductDto>.Success(MapToDto(product));
    }

    public async Task<ServiceResult<ProductDto>> UpdateAsync(
        string id,
        UpdateProductDto request,
        CancellationToken cancellationToken)
    {
        var existingProduct = await _productRepository.GetByIdAsync(id, cancellationToken);
        if (existingProduct is null)
        {
            return ServiceResult<ProductDto>.NotFound(["Product was not found."]);
        }

        var errors = ValidateProductRequest(
            request.Name,
            request.CategoryId,
            request.CategoryName,
            request.PriceCents,
            request.Currency,
            request.StockStatus);

        if (errors.Count > 0)
        {
            return ServiceResult<ProductDto>.ValidationFailure(errors);
        }

        existingProduct.Name = request.Name.Trim();
        existingProduct.CategoryId = request.CategoryId.Trim();
        existingProduct.CategoryName = request.CategoryName.Trim();
        existingProduct.Finish = request.Finish?.Trim() ?? string.Empty;
        existingProduct.Spec = request.Spec?.Trim() ?? string.Empty;
        existingProduct.ShortDescription = request.ShortDescription?.Trim() ?? string.Empty;
        existingProduct.Features = NormalizeFeatures(request.Features);
        existingProduct.PriceCents = request.PriceCents;
        existingProduct.Currency = request.Currency.Trim().ToUpperInvariant();
        existingProduct.InStock = request.InStock;
        existingProduct.StockStatus = request.StockStatus.Trim().ToLowerInvariant();
        existingProduct.Visual = request.Visual?.Trim() ?? string.Empty;
        existingProduct.Tone = request.Tone?.Trim() ?? string.Empty;
        existingProduct.UpdatedAt = DateTime.UtcNow;

        var updatedProduct = await _productRepository.UpdateAsync(
            existingProduct,
            cancellationToken);

        return updatedProduct is null
            ? ServiceResult<ProductDto>.NotFound(["Product was not found."])
            : ServiceResult<ProductDto>.Success(MapToDto(updatedProduct));
    }

    public async Task<ServiceResult<bool>> DeleteAsync(
        string id,
        CancellationToken cancellationToken)
    {
        var deleted = await _productRepository.DeleteAsync(id, cancellationToken);

        return deleted
            ? ServiceResult<bool>.Success(true)
            : ServiceResult<bool>.NotFound(["Product was not found."]);
    }

    private static List<string> ValidateProductRequest(
        string? name,
        string? categoryId,
        string? categoryName,
        int priceCents,
        string? currency,
        string? stockStatus)
    {
        var errors = new List<string>();

        if (!ValidationHelper.HasValue(name))
        {
            errors.Add("Product name is required.");
        }

        if (!ValidationHelper.HasValue(categoryId))
        {
            errors.Add("Category id is required.");
        }

        if (!ValidationHelper.HasValue(categoryName))
        {
            errors.Add("Category name is required.");
        }

        if (!ValidationHelper.IsPositive(priceCents))
        {
            errors.Add("Price cents must be greater than 0.");
        }

        if (!ValidationHelper.HasValue(currency))
        {
            errors.Add("Currency is required.");
        }

        if (!IsSupportedStockStatus(stockStatus))
        {
            errors.Add("Stock status must be in_stock, low_stock, waitlist, or out_of_stock.");
        }

        return errors;
    }

    private static bool IsSupportedStockStatus(string? stockStatus)
    {
        if (!ValidationHelper.HasValue(stockStatus))
        {
            return false;
        }

        return AllowedStockStatuses.Contains(stockStatus!.Trim().ToLowerInvariant());
    }

    private static List<string> NormalizeFeatures(List<string>? features)
    {
        return features?
            .Where(ValidationHelper.HasValue)
            .Select(feature => feature.Trim())
            .ToList() ?? [];
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto(
            product.Id,
            product.Name,
            product.CategoryId,
            product.CategoryName,
            product.Finish,
            product.Spec,
            product.ShortDescription,
            product.Features,
            product.PriceCents,
            product.Currency,
            product.InStock,
            product.StockStatus,
            product.Visual,
            product.Tone,
            product.CreatedAt,
            product.UpdatedAt);
    }
}
