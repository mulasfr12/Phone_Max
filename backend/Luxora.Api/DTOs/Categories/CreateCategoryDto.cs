namespace Luxora.Api.DTOs.Categories;

public sealed record CreateCategoryDto(
    string Name,
    string Description,
    int SortOrder);
