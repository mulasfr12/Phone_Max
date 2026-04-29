using Luxora.Api.Repositories.Interfaces;
using Luxora.Api.Services.Interfaces;

namespace Luxora.Api.Services;

public sealed class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }
}
