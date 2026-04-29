using Luxora.Api.DTOs.Categories;
using Luxora.Api.Services;

namespace Luxora.Api.Services.Interfaces;

public interface ICategoryService
{
    Task<IReadOnlyList<CategoryDto>> GetAllAsync(CancellationToken cancellationToken);

    Task<CategoryDto?> GetByIdAsync(string id, CancellationToken cancellationToken);

    Task<ServiceResult<CategoryDto>> CreateAsync(
        CreateCategoryDto request,
        CancellationToken cancellationToken);

    Task<ServiceResult<CategoryDto>> UpdateAsync(
        string id,
        UpdateCategoryDto request,
        CancellationToken cancellationToken);

    Task<ServiceResult<bool>> DeleteAsync(string id, CancellationToken cancellationToken);
}
