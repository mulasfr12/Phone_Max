using Luxora.Api.DTOs.Categories;
using Luxora.Api.Helpers;
using Luxora.Api.Models;
using Luxora.Api.Repositories.Interfaces;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Validators;

namespace Luxora.Api.Services;

public sealed class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IReadOnlyList<CategoryDto>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetAllAsync(cancellationToken);
        return categories.Select(MapToDto).ToList();
    }

    public async Task<CategoryDto?> GetByIdAsync(
        string id,
        CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        return category is null ? null : MapToDto(category);
    }

    public async Task<ServiceResult<CategoryDto>> CreateAsync(
        CreateCategoryDto request,
        CancellationToken cancellationToken)
    {
        var errors = ValidateCategoryRequest(
            request.Name,
            request.Description,
            request.SortOrder);

        if (errors.Count > 0)
        {
            return ServiceResult<CategoryDto>.ValidationFailure(errors);
        }

        var category = new Category
        {
            Id = IdHelper.NormalizeId(request.Name),
            Name = request.Name.Trim(),
            Description = request.Description.Trim(),
            SortOrder = request.SortOrder,
            CreatedAt = DateTime.UtcNow
        };

        await _categoryRepository.CreateAsync(category, cancellationToken);

        return ServiceResult<CategoryDto>.Success(MapToDto(category));
    }

    public async Task<ServiceResult<CategoryDto>> UpdateAsync(
        string id,
        UpdateCategoryDto request,
        CancellationToken cancellationToken)
    {
        var existingCategory = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        if (existingCategory is null)
        {
            return ServiceResult<CategoryDto>.NotFound(["Category was not found."]);
        }

        var errors = ValidateCategoryRequest(
            request.Name,
            request.Description,
            request.SortOrder);

        if (errors.Count > 0)
        {
            return ServiceResult<CategoryDto>.ValidationFailure(errors);
        }

        existingCategory.Name = request.Name.Trim();
        existingCategory.Description = request.Description.Trim();
        existingCategory.SortOrder = request.SortOrder;
        existingCategory.UpdatedAt = DateTime.UtcNow;

        var updatedCategory = await _categoryRepository.UpdateAsync(
            existingCategory,
            cancellationToken);

        return updatedCategory is null
            ? ServiceResult<CategoryDto>.NotFound(["Category was not found."])
            : ServiceResult<CategoryDto>.Success(MapToDto(updatedCategory));
    }

    public async Task<ServiceResult<bool>> DeleteAsync(
        string id,
        CancellationToken cancellationToken)
    {
        var deleted = await _categoryRepository.DeleteAsync(id, cancellationToken);

        return deleted
            ? ServiceResult<bool>.Success(true)
            : ServiceResult<bool>.NotFound(["Category was not found."]);
    }

    private static List<string> ValidateCategoryRequest(
        string? name,
        string? description,
        int sortOrder)
    {
        var errors = new List<string>();

        if (!ValidationHelper.HasValue(name))
        {
            errors.Add("Category name is required.");
        }

        if (!ValidationHelper.HasValue(description))
        {
            errors.Add("Category description is required.");
        }

        if (sortOrder < 0)
        {
            errors.Add("Sort order must be greater than or equal to 0.");
        }

        return errors;
    }

    private static CategoryDto MapToDto(Category category)
    {
        return new CategoryDto(
            category.Id,
            category.Name,
            category.Description,
            category.SortOrder,
            category.CreatedAt,
            category.UpdatedAt);
    }
}
