namespace Luxora.Api.Settings;

public sealed class MongoDbSettings
{
    public const string SectionName = "MongoDb";

    public string ConnectionString { get; init; } = string.Empty;

    public string DatabaseName { get; init; } = string.Empty;

    public string ProductsCollectionName { get; init; } = "products";

    public string CategoriesCollectionName { get; init; } = "categories";

    public string CheckoutRequestsCollectionName { get; init; } = "checkoutRequests";

    public string AdminUsersCollectionName { get; init; } = "adminUsers";
}
