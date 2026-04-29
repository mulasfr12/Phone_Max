namespace Luxora.Api.DTOs.Products;

public sealed record CreateProductDto(
    string Name,
    string CategoryId,
    string CategoryName,
    string Finish,
    string Spec,
    string ShortDescription,
    List<string>? Features,
    int PriceCents,
    string Currency,
    bool InStock,
    string StockStatus,
    string Visual,
    string Tone);
