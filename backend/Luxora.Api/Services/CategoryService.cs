using Luxora.Api.Repositories.Interfaces;
using Luxora.Api.Services.Interfaces;

namespace Luxora.Api.Services;

public sealed class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }
}
