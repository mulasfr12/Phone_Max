using Luxora.Api.Models;
using Luxora.Api.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Luxora.Api.Data;

public sealed class MongoDbContext
{
    public MongoDbContext(IOptions<MongoDbSettings> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);

        Products = database.GetCollection<Product>(settings.ProductsCollectionName);
        Categories = database.GetCollection<Category>(settings.CategoriesCollectionName);
        CheckoutRequests = database.GetCollection<CheckoutRequest>(
            settings.CheckoutRequestsCollectionName);
    }

    public IMongoCollection<Product> Products { get; }

    public IMongoCollection<Category> Categories { get; }

    public IMongoCollection<CheckoutRequest> CheckoutRequests { get; }
}
