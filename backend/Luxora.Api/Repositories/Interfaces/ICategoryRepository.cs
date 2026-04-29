using Luxora.Api.Models;

namespace Luxora.Api.Repositories.Interfaces;

public interface ICategoryRepository
{
    Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken cancellationToken);

    Task<Category?> GetByIdAsync(string id, CancellationToken cancellationToken);
}
