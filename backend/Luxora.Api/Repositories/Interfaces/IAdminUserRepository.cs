using Luxora.Api.Models;

namespace Luxora.Api.Repositories.Interfaces;

public interface IAdminUserRepository
{
    Task<AdminUser?> GetByEmailAsync(string email, CancellationToken cancellationToken);

    Task<AdminUser?> GetByIdAsync(string id, CancellationToken cancellationToken);

    Task CreateAsync(AdminUser adminUser, CancellationToken cancellationToken);

    Task<bool> ExistsAsync(string email, CancellationToken cancellationToken);

    Task RecordFailedLoginAsync(
        string id,
        int failedLoginAttempts,
        DateTime? lockoutUntil,
        DateTime now,
        CancellationToken cancellationToken);

    Task RecordSuccessfulLoginAsync(
        string id,
        DateTime now,
        CancellationToken cancellationToken);

    Task UpdatePasswordAsync(
        string id,
        string passwordHash,
        DateTime now,
        CancellationToken cancellationToken);
}
