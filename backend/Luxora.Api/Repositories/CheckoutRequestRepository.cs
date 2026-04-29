using Luxora.Api.Data;
using Luxora.Api.Models;
using Luxora.Api.Repositories.Interfaces;
using MongoDB.Driver;

namespace Luxora.Api.Repositories;

public sealed class CheckoutRequestRepository : ICheckoutRequestRepository
{
    private readonly MongoDbContext _context;

    public CheckoutRequestRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<CheckoutRequest>> GetAllAsync(
        string? status,
        string? paymentStatus,
        string? fulfillmentPreference,
        string? paymentMethod,
        CancellationToken cancellationToken)
    {
        var filterBuilder = Builders<CheckoutRequest>.Filter;
        var filters = new List<FilterDefinition<CheckoutRequest>>();

        if (!string.IsNullOrWhiteSpace(status))
        {
            filters.Add(filterBuilder.Eq(request => request.Status, status.Trim().ToLowerInvariant()));
        }

        if (!string.IsNullOrWhiteSpace(paymentStatus))
        {
            filters.Add(filterBuilder.Eq(request => request.PaymentStatus, paymentStatus.Trim().ToLowerInvariant()));
        }

        if (!string.IsNullOrWhiteSpace(fulfillmentPreference))
        {
            filters.Add(filterBuilder.Eq(request => request.FulfillmentPreference, fulfillmentPreference.Trim().ToLowerInvariant()));
        }

        if (!string.IsNullOrWhiteSpace(paymentMethod))
        {
            filters.Add(filterBuilder.Eq(request => request.PaymentMethod, paymentMethod.Trim().ToLowerInvariant()));
        }

        var filter = filters.Count > 0
            ? filterBuilder.And(filters)
            : filterBuilder.Empty;

        return await _context.CheckoutRequests
            .Find(filter)
            .SortByDescending(checkoutRequest => checkoutRequest.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task CreateAsync(
        CheckoutRequest checkoutRequest,
        CancellationToken cancellationToken)
    {
        await _context.CheckoutRequests.InsertOneAsync(
            checkoutRequest,
            cancellationToken: cancellationToken);
    }

    public async Task<CheckoutRequest?> GetByIdAsync(
        string id,
        CancellationToken cancellationToken)
    {
        return await _context.CheckoutRequests
            .Find(checkoutRequest => checkoutRequest.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<CheckoutRequest?> UpdateStatusAsync(
        string id,
        string status,
        DateTime updatedAt,
        CancellationToken cancellationToken)
    {
        var update = Builders<CheckoutRequest>.Update
            .Set(checkoutRequest => checkoutRequest.Status, status)
            .Set(checkoutRequest => checkoutRequest.UpdatedAt, updatedAt);

        var filter = Builders<CheckoutRequest>.Filter.Eq(
            checkoutRequest => checkoutRequest.Id,
            id);

        var result = await _context.CheckoutRequests.UpdateOneAsync(
            filter,
            update,
            options: null,
            cancellationToken);

        return result.MatchedCount == 0
            ? null
            : await GetByIdAsync(id, cancellationToken);
    }

    public async Task<CheckoutRequest?> UpdatePaymentStatusAsync(
        string id,
        string paymentStatus,
        DateTime updatedAt,
        CancellationToken cancellationToken)
    {
        var update = Builders<CheckoutRequest>.Update
            .Set(checkoutRequest => checkoutRequest.PaymentStatus, paymentStatus)
            .Set(checkoutRequest => checkoutRequest.UpdatedAt, updatedAt);

        var filter = Builders<CheckoutRequest>.Filter.Eq(
            checkoutRequest => checkoutRequest.Id,
            id);

        var result = await _context.CheckoutRequests.UpdateOneAsync(
            filter,
            update,
            options: null,
            cancellationToken);

        return result.MatchedCount == 0
            ? null
            : await GetByIdAsync(id, cancellationToken);
    }
}
