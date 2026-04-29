namespace Luxora.Api.DTOs.Categories;

public sealed record CategoryDto(
    string Id,
    string Name,
    string Description,
    int SortOrder,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
