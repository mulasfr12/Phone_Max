using Luxora.Api.DTOs.Categories;
using Luxora.Api.Services;
using Luxora.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Api.Controllers;

[ApiController]
[Route("api/admin/categories")]
public sealed class AdminCategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public AdminCategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // TODO: Protect admin endpoints with authentication and authorization before production.
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<CategoryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetCategories(
        CancellationToken cancellationToken)
    {
        var categories = await _categoryService.GetAllAsync(cancellationToken);
        return Ok(categories);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CategoryDto>> GetCategoryById(
        string id,
        CancellationToken cancellationToken)
    {
        var category = await _categoryService.GetByIdAsync(id, cancellationToken);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    [HttpPost]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CategoryDto>> CreateCategory(
        CreateCategoryDto request,
        CancellationToken cancellationToken)
    {
        var result = await _categoryService.CreateAsync(request, cancellationToken);

        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        var category = result.Value!;
        return Created($"/api/admin/categories/{category.Id}", category);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CategoryDto>> UpdateCategory(
        string id,
        UpdateCategoryDto request,
        CancellationToken cancellationToken)
    {
        var result = await _categoryService.UpdateAsync(id, request, cancellationToken);
        return ToActionResult(result);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCategory(
        string id,
        CancellationToken cancellationToken)
    {
        var result = await _categoryService.DeleteAsync(id, cancellationToken);

        if (result.IsNotFound)
        {
            return NotFound(new { errors = result.Errors });
        }

        return NoContent();
    }

    private ActionResult<CategoryDto> ToActionResult(ServiceResult<CategoryDto> result)
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
