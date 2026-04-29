using Luxora.Api.Data;
using Luxora.Api.Models;
using Luxora.Api.Repositories.Interfaces;
using MongoDB.Driver;

namespace Luxora.Api.Repositories;

public sealed class AdminUserRepository : IAdminUserRepository
{
    private readonly MongoDbContext _context;

    public AdminUserRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<AdminUser?> GetByEmailAsync(
        string email,
        CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        return await _context.AdminUsers
            .Find(adminUser => adminUser.Email == normalizedEmail)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<AdminUser?> GetByIdAsync(
        string id,
        CancellationToken cancellationToken)
    {
        return await _context.AdminUsers
            .Find(adminUser => adminUser.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task CreateAsync(
        AdminUser adminUser,
        CancellationToken cancellationToken)
    {
        await _context.AdminUsers.InsertOneAsync(
            adminUser,
            cancellationToken: cancellationToken);
    }

    public async Task<bool> ExistsAsync(
        string email,
        CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        return await _context.AdminUsers
            .Find(adminUser => adminUser.Email == normalizedEmail)
            .AnyAsync(cancellationToken);
    }
}
