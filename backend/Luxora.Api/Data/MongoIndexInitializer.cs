using Luxora.Api.Models;
using MongoDB.Driver;

namespace Luxora.Api.Data;

public sealed class MongoIndexInitializer
{
    private readonly MongoDbContext _context;

    public MongoIndexInitializer(MongoDbContext context)
    {
        _context = context;
    }

    public async Task InitializeAsync(CancellationToken cancellationToken)
    {
        await InitializeAdminUserIndexesAsync(cancellationToken);
        await InitializeProductIndexesAsync(cancellationToken);
        await InitializeCategoryIndexesAsync(cancellationToken);
        await InitializeCheckoutRequestIndexesAsync(cancellationToken);
    }

    private async Task InitializeAdminUserIndexesAsync(CancellationToken cancellationToken)
    {
        var emailIndex = new CreateIndexModel<AdminUser>(
            Builders<AdminUser>.IndexKeys.Ascending(adminUser => adminUser.Email),
            new CreateIndexOptions
            {
                Unique = true,
                Name = "ux_adminUsers_email"
            });

        await _context.AdminUsers.Indexes.CreateOneAsync(
            emailIndex,
            cancellationToken: cancellationToken);
    }

    private async Task InitializeProductIndexesAsync(CancellationToken cancellationToken)
    {
        // Product.Id is stored as MongoDB _id via [BsonId], so MongoDB already
        // enforces uniqueness for it. These indexes support common browse/admin filters.
        var indexes = new[]
        {
            new CreateIndexModel<Product>(
                Builders<Product>.IndexKeys.Ascending(product => product.CategoryId),
                new CreateIndexOptions { Name = "ix_products_categoryId" }),
            new CreateIndexModel<Product>(
                Builders<Product>.IndexKeys.Ascending(product => product.Name),
                new CreateIndexOptions { Name = "ix_products_name" })
        };

        await _context.Products.Indexes.CreateManyAsync(
            indexes,
            cancellationToken);
    }

    private async Task InitializeCategoryIndexesAsync(CancellationToken cancellationToken)
    {
        // Category.Id is stored as MongoDB _id via [BsonId], so MongoDB already
        // enforces uniqueness for it.
        var sortIndex = new CreateIndexModel<Category>(
            Builders<Category>.IndexKeys
                .Ascending(category => category.SortOrder)
                .Ascending(category => category.Name),
            new CreateIndexOptions { Name = "ix_categories_sortOrder_name" });

        await _context.Categories.Indexes.CreateOneAsync(
            sortIndex,
            cancellationToken: cancellationToken);
    }

    private async Task InitializeCheckoutRequestIndexesAsync(CancellationToken cancellationToken)
    {
        var indexes = new[]
        {
            new CreateIndexModel<CheckoutRequest>(
                Builders<CheckoutRequest>.IndexKeys.Ascending(request => request.Status),
                new CreateIndexOptions { Name = "ix_checkoutRequests_status" }),
            new CreateIndexModel<CheckoutRequest>(
                Builders<CheckoutRequest>.IndexKeys.Ascending(request => request.PaymentStatus),
                new CreateIndexOptions { Name = "ix_checkoutRequests_paymentStatus" }),
            new CreateIndexModel<CheckoutRequest>(
                Builders<CheckoutRequest>.IndexKeys.Descending(request => request.CreatedAt),
                new CreateIndexOptions { Name = "ix_checkoutRequests_createdAt_desc" })
        };

        await _context.CheckoutRequests.Indexes.CreateManyAsync(
            indexes,
            cancellationToken);
    }
}
