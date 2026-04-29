namespace Luxora.Api.DTOs.Categories;

public sealed record UpdateCategoryDto(
    string Name,
    string Description,
    int SortOrder);
