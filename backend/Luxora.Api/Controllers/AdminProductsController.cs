using Luxora.Api.DTOs.Products;
using Luxora.Api.Services;
using Luxora.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/products")]
public sealed class AdminProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public AdminProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ProductDto>>> GetProducts(
        [FromQuery] string? categoryId,
        [FromQuery] string? categoryName,
        [FromQuery] bool? inStock,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var products = await _productService.GetAllAsync(
            categoryId,
            categoryName,
            inStock,
            search,
            cancellationToken);

        return Ok(products);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> GetProductById(
        string id,
        CancellationToken cancellationToken)
    {
        var product = await _productService.GetByIdAsync(id, cancellationToken);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductDto>> CreateProduct(
        CreateProductDto request,
        CancellationToken cancellationToken)
    {
        var result = await _productService.CreateAsync(request, cancellationToken);

        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        var product = result.Value!;
        return Created($"/api/admin/products/{product.Id}", product);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> UpdateProduct(
        string id,
        UpdateProductDto request,
        CancellationToken cancellationToken)
    {
        var result = await _productService.UpdateAsync(id, request, cancellationToken);
        return ToActionResult(result);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProduct(
        string id,
        CancellationToken cancellationToken)
    {
        var result = await _productService.DeleteAsync(id, cancellationToken);

        if (result.IsNotFound)
        {
            return NotFound(new { errors = result.Errors });
        }

        return NoContent();
    }

    [HttpGet("{productId}/images")]
    [ProducesResponseType(typeof(IReadOnlyList<ProductImageDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IReadOnlyList<ProductImageDto>>> GetProductImages(
        string productId,
        CancellationToken cancellationToken)
    {
        var result = await _productService.GetProductImagesAsync(
            productId,
            cancellationToken);

        return ToImageListActionResult(result);
    }

    [HttpPost("{productId}/images")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ProductImageDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductImageDto>> UploadProductImage(
        string productId,
        [FromForm] IFormFile file,
        [FromForm] string? altText,
        [FromForm] bool setPrimary,
        CancellationToken cancellationToken)
    {
        var result = await _productService.UploadProductImageAsync(
            productId,
            file,
            altText,
            setPrimary,
            cancellationToken);

        if (result.IsSuccess)
        {
            var image = result.Value!;
            return Created(
                $"/api/admin/products/{productId}/images/{image.Id}",
                image);
        }

        if (result.IsNotFound)
        {
            return NotFound(new { errors = result.Errors });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [HttpPatch("{productId}/images/{imageId}/primary")]
    [ProducesResponseType(typeof(IReadOnlyList<ProductImageDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IReadOnlyList<ProductImageDto>>> SetPrimaryProductImage(
        string productId,
        string imageId,
        CancellationToken cancellationToken)
    {
        var result = await _productService.SetPrimaryProductImageAsync(
            productId,
            imageId,
            cancellationToken);

        return ToImageListActionResult(result);
    }

    [HttpDelete("{productId}/images/{imageId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProductImage(
        string productId,
        string imageId,
        CancellationToken cancellationToken)
    {
        var result = await _productService.DeleteProductImageAsync(
            productId,
            imageId,
            cancellationToken);

        if (result.IsNotFound)
        {
            return NotFound(new { errors = result.Errors });
        }

        return NoContent();
    }

    private ActionResult<ProductDto> ToActionResult(ServiceResult<ProductDto> result)
    {
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        if (result.IsNotFound)
        {
            return NotFound(new { errors = result.Errors });
        }

        return BadRequest(new { errors = result.Errors });
    }

    private ActionResult<IReadOnlyList<ProductImageDto>> ToImageListActionResult(
        ServiceResult<IReadOnlyList<ProductImageDto>> result)
    {
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        if (result.IsNotFound)
        {
            return NotFound(new { errors = result.Errors });
        }

        return BadRequest(new { errors = result.Errors });
    }
}
