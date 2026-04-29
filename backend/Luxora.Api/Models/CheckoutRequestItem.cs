namespace Luxora.Api.Models;

public sealed class CheckoutRequestItem
{
    public string ProductId { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public int UnitPriceCents { get; set; }

    public string ProductName { get; set; } = string.Empty;
}
