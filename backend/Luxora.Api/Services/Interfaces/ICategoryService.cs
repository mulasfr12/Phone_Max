using Luxora.Api.DTOs.Categories;

namespace Luxora.Api.Services.Interfaces;

public interface ICategoryService
{
    Task<IReadOnlyList<CategoryDto>> GetAllAsync(CancellationToken cancellationToken);

    Task<CategoryDto?> GetByIdAsync(string id, CancellationToken cancellationToken);
}
