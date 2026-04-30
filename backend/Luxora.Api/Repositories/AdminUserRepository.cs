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

    public async Task RecordFailedLoginAsync(
        string id,
        int failedLoginAttempts,
        DateTime? lockoutUntil,
        DateTime now,
        CancellationToken cancellationToken)
    {
        var update = Builders<AdminUser>.Update
            .Set(adminUser => adminUser.FailedLoginAttempts, failedLoginAttempts)
            .Set(adminUser => adminUser.LockoutUntil, lockoutUntil)
            .Set(adminUser => adminUser.LastFailedLoginAt, now)
            .Set(adminUser => adminUser.UpdatedAt, now);

        await _context.AdminUsers.UpdateOneAsync(
            adminUser => adminUser.Id == id,
            update,
            cancellationToken: cancellationToken);
    }

    public async Task RecordSuccessfulLoginAsync(
        string id,
        DateTime now,
        CancellationToken cancellationToken)
    {
        var update = Builders<AdminUser>.Update
            .Set(adminUser => adminUser.FailedLoginAttempts, 0)
            .Set(adminUser => adminUser.LockoutUntil, null)
            .Set(adminUser => adminUser.LastLoginAt, now)
            .Set(adminUser => adminUser.UpdatedAt, now);

        await _context.AdminUsers.UpdateOneAsync(
            adminUser => adminUser.Id == id,
            update,
            cancellationToken: cancellationToken);
    }

    public async Task UpdatePasswordAsync(
        string id,
        string passwordHash,
        DateTime now,
        CancellationToken cancellationToken)
    {
        var update = Builders<AdminUser>.Update
            .Set(adminUser => adminUser.PasswordHash, passwordHash)
            .Set(adminUser => adminUser.FailedLoginAttempts, 0)
            .Set(adminUser => adminUser.LockoutUntil, null)
            .Set(adminUser => adminUser.UpdatedAt, now);

        await _context.AdminUsers.UpdateOneAsync(
            adminUser => adminUser.Id == id,
            update,
            cancellationToken: cancellationToken);
    }
}
