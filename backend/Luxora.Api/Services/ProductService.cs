using Luxora.Api.DTOs.Products;
using Luxora.Api.Models;
using Luxora.Api.Repositories.Interfaces;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Helpers;
using Luxora.Api.Validators;
using Luxora.Api.Settings;
using Microsoft.Extensions.Options;

namespace Luxora.Api.Services;

public sealed class ProductService : IProductService
{
    private const string ImageStorageUnavailableMessage =
        "Image storage is not configured or unavailable. Please check Azure Blob Storage settings.";
    private const string ImageDeleteFailedMessage =
        "Image deletion could not be completed. Please check Azure Blob Storage settings.";

    private static readonly string[] AllowedStockStatuses = [
        "in_stock",
        "low_stock",
        "waitlist",
        "out_of_stock"
    ];

    private readonly IProductRepository _productRepository;
    private readonly IImageStorageService _imageStorageService;
    private readonly ImageStorageSettings _imageStorageSettings;
    private readonly ILogger<ProductService> _logger;

    public ProductService(
        IProductRepository productRepository,
        IImageStorageService imageStorageService,
        IOptions<ImageStorageSettings> imageStorageOptions,
        ILogger<ProductService> logger)
    {
        _productRepository = productRepository;
        _imageStorageService = imageStorageService;
        _imageStorageSettings = imageStorageOptions.Value;
        _logger = logger;
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

    public async Task<ServiceResult<ProductImageDto>> UploadProductImageAsync(
        string productId,
        IFormFile file,
        string? altText,
        bool setPrimary,
        CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(productId, cancellationToken);
        if (product is null)
        {
            return ServiceResult<ProductImageDto>.NotFound(["Product was not found."]);
        }

        var errors = await ValidateImageFileAsync(file, cancellationToken);
        if (errors.Count > 0)
        {
            return ServiceResult<ProductImageDto>.ValidationFailure(errors);
        }

        var existingImages = product.Images ?? [];
        StoredImageResult storedImage;
        try
        {
            storedImage = await _imageStorageService.SaveAsync(
                productId,
                file,
                cancellationToken);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            _logger.LogWarning(
                exception,
                "Product image upload failed while saving to storage for product {ProductId}.",
                productId);
            return ServiceResult<ProductImageDto>.ValidationFailure([
                ImageStorageUnavailableMessage
            ]);
        }

        var shouldBePrimary = setPrimary || existingImages.Count == 0;

        var image = new ProductImage
        {
            Id = Guid.NewGuid().ToString("N"),
            Url = storedImage.Url,
            FileName = storedImage.FileName,
            OriginalFileName = storedImage.OriginalFileName,
            ContentType = storedImage.ContentType,
            SizeBytes = storedImage.SizeBytes,
            AltText = ValidationHelper.HasValue(altText) ? altText!.Trim() : null,
            IsPrimary = shouldBePrimary,
            UploadedAt = DateTime.UtcNow
        };

        if (shouldBePrimary)
        {
            var normalizedImages = existingImages
                .Select(existingImage =>
                {
                    existingImage.IsPrimary = false;
                    return existingImage;
                })
                .Append(image)
                .ToList();

            try
            {
                var updatedProduct = await _productRepository.ReplaceImagesAsync(
                    productId,
                    normalizedImages,
                    cancellationToken);

                if (updatedProduct is null)
                {
                    await TryDeleteStoredImageAsync(productId, storedImage.FileName, cancellationToken);
                    return ServiceResult<ProductImageDto>.NotFound(["Product was not found."]);
                }
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                _logger.LogWarning(
                    exception,
                    "Product image upload metadata save failed for product {ProductId}.",
                    productId);
                await TryDeleteStoredImageAsync(productId, storedImage.FileName, cancellationToken);
                return ServiceResult<ProductImageDto>.ValidationFailure([
                    "Image metadata could not be saved. The uploaded blob was cleaned up."
                ]);
            }
        }
        else
        {
            try
            {
                var updatedProduct = await _productRepository.AddImageAsync(
                    productId,
                    image,
                    cancellationToken);

                if (updatedProduct is null)
                {
                    await TryDeleteStoredImageAsync(productId, storedImage.FileName, cancellationToken);
                    return ServiceResult<ProductImageDto>.NotFound(["Product was not found."]);
                }
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                _logger.LogWarning(
                    exception,
                    "Product image upload metadata save failed for product {ProductId}.",
                    productId);
                await TryDeleteStoredImageAsync(productId, storedImage.FileName, cancellationToken);
                return ServiceResult<ProductImageDto>.ValidationFailure([
                    "Image metadata could not be saved. The uploaded blob was cleaned up."
                ]);
            }
        }

        return ServiceResult<ProductImageDto>.Success(MapImageToDto(image));
    }

    public async Task<ServiceResult<IReadOnlyList<ProductImageDto>>> GetProductImagesAsync(
        string productId,
        CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(productId, cancellationToken);
        if (product is null)
        {
            return ServiceResult<IReadOnlyList<ProductImageDto>>.NotFound([
                "Product was not found."
            ]);
        }

        return ServiceResult<IReadOnlyList<ProductImageDto>>.Success(
            NormalizeImages(product.Images).Select(MapImageToDto).ToList());
    }

    public async Task<ServiceResult<IReadOnlyList<ProductImageDto>>> SetPrimaryProductImageAsync(
        string productId,
        string imageId,
        CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(productId, cancellationToken);
        if (product is null)
        {
            return ServiceResult<IReadOnlyList<ProductImageDto>>.NotFound([
                "Product was not found."
            ]);
        }

        var images = NormalizeImages(product.Images);
        if (!images.Any(image => image.Id == imageId))
        {
            return ServiceResult<IReadOnlyList<ProductImageDto>>.NotFound([
                "Product image was not found."
            ]);
        }

        foreach (var image in images)
        {
            image.IsPrimary = image.Id == imageId;
        }

        var updatedProduct = await _productRepository.ReplaceImagesAsync(
            productId,
            images,
            cancellationToken);

        return ServiceResult<IReadOnlyList<ProductImageDto>>.Success(
            NormalizeImages(updatedProduct?.Images).Select(MapImageToDto).ToList());
    }

    public async Task<ServiceResult<bool>> DeleteProductImageAsync(
        string productId,
        string imageId,
        CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(productId, cancellationToken);
        if (product is null)
        {
            return ServiceResult<bool>.NotFound(["Product was not found."]);
        }

        var images = NormalizeImages(product.Images);
        var imageToDelete = images.FirstOrDefault(image => image.Id == imageId);
        if (imageToDelete is null)
        {
            return ServiceResult<bool>.NotFound(["Product image was not found."]);
        }

        var remainingImages = images
            .Where(image => image.Id != imageId)
            .ToList();

        if (imageToDelete.IsPrimary && remainingImages.Count > 0)
        {
            remainingImages[0].IsPrimary = true;
        }

        if (remainingImages.Count > 0 && !remainingImages.Any(image => image.IsPrimary))
        {
            remainingImages[0].IsPrimary = true;
        }

        bool storageDeleted;
        try
        {
            storageDeleted = await _imageStorageService.DeleteAsync(
                productId,
                imageToDelete.FileName,
                cancellationToken);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            _logger.LogWarning(
                exception,
                "Product image delete failed while removing blob for product {ProductId}.",
                productId);
            return ServiceResult<bool>.ValidationFailure([ImageDeleteFailedMessage]);
        }

        if (!storageDeleted)
        {
            _logger.LogWarning(
                "Product image delete skipped because blob name was outside product scope. ProductId: {ProductId}, BlobName: {BlobName}",
                productId,
                imageToDelete.FileName);
            return ServiceResult<bool>.ValidationFailure([ImageDeleteFailedMessage]);
        }

        Product? updatedProduct;
        try
        {
            updatedProduct = await _productRepository.ReplaceImagesAsync(
                productId,
                remainingImages,
                cancellationToken);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            _logger.LogWarning(
                exception,
                "Product image metadata delete failed after blob removal for product {ProductId}.",
                productId);
            return ServiceResult<bool>.ValidationFailure([
                "Image metadata could not be updated after blob deletion."
            ]);
        }

        if (updatedProduct is null)
        {
            return ServiceResult<bool>.NotFound(["Product was not found."]);
        }

        return ServiceResult<bool>.Success(true);
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

    private async Task<List<string>> ValidateImageFileAsync(
        IFormFile? file,
        CancellationToken cancellationToken)
    {
        var errors = new List<string>();

        if (file is null || file.Length == 0)
        {
            errors.Add("Image file is required.");
            return errors;
        }

        if (file.Length > _imageStorageSettings.MaxFileSizeBytes)
        {
            errors.Add("Image file is too large.");
        }

        if (!_imageStorageSettings.AllowedContentTypes.Contains(
            file.ContentType,
            StringComparer.OrdinalIgnoreCase))
        {
            errors.Add("Image file type is not supported.");
        }

        if (errors.Count == 0
            && !await ImageFileValidator.MatchesContentTypeAsync(
                file,
                file.ContentType,
                cancellationToken))
        {
            errors.Add("Image file signature does not match the selected image type.");
        }

        return errors;
    }

    private async Task TryDeleteStoredImageAsync(
        string productId,
        string fileName,
        CancellationToken cancellationToken)
    {
        try
        {
            await _imageStorageService.DeleteAsync(productId, fileName, cancellationToken);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            _logger.LogWarning(
                exception,
                "Compensating product image cleanup failed for product {ProductId}.",
                productId);
        }
    }

    private static List<ProductImage> NormalizeImages(List<ProductImage>? images)
    {
        return images?
            .OrderByDescending(image => image.IsPrimary)
            .ThenBy(image => image.UploadedAt)
            .ToList() ?? [];
    }

    private static ProductImageDto MapImageToDto(ProductImage image)
    {
        return new ProductImageDto(
            image.Id,
            image.Url,
            image.FileName,
            image.OriginalFileName,
            image.ContentType,
            image.SizeBytes,
            image.AltText,
            image.IsPrimary,
            image.UploadedAt);
    }

    private static ProductDto MapToDto(Product product)
    {
        var images = NormalizeImages(product.Images);
        var primaryImageUrl = images.FirstOrDefault(image => image.IsPrimary)?.Url
            ?? images.FirstOrDefault()?.Url;

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
            images.Select(MapImageToDto).ToList(),
            primaryImageUrl,
            product.CreatedAt,
            product.UpdatedAt);
    }
}
