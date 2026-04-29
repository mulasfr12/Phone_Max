using Luxora.Api.Models;

namespace Luxora.Api.Repositories.Interfaces;

public interface IAdminUserRepository
{
    Task<AdminUser?> GetByEmailAsync(string email, CancellationToken cancellationToken);

    Task<AdminUser?> GetByIdAsync(string id, CancellationToken cancellationToken);

    Task CreateAsync(AdminUser adminUser, CancellationToken cancellationToken);

    Task<bool> ExistsAsync(string email, CancellationToken cancellationToken);
}
