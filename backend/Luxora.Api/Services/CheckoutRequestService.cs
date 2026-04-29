using Luxora.Api.DTOs.CheckoutRequests;
using Luxora.Api.Helpers;
using Luxora.Api.Models;
using Luxora.Api.Repositories.Interfaces;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Validators;

namespace Luxora.Api.Services;

public sealed class CheckoutRequestService : ICheckoutRequestService
{
    private static readonly string[] AllowedFulfillmentPreferences = ["delivery", "pickup"];
    private static readonly string[] AllowedPaymentMethods = ["pay_on_delivery", "manual_lipa_payment"];
    private static readonly string[] AllowedStatuses = ["pending", "contacted", "confirmed", "fulfilled", "cancelled"];
    private static readonly string[] AllowedPaymentStatuses = ["not_paid", "awaiting_manual_confirmation", "paid", "rejected"];

    private readonly ICheckoutRequestRepository _checkoutRequestRepository;
    private readonly IProductRepository _productRepository;

    public CheckoutRequestService(
        ICheckoutRequestRepository checkoutRequestRepository,
        IProductRepository productRepository)
    {
        _checkoutRequestRepository = checkoutRequestRepository;
        _productRepository = productRepository;
    }

    public async Task<IReadOnlyList<CheckoutRequestDto>> GetAllAsync(
        string? status,
        string? paymentStatus,
        string? fulfillmentPreference,
        string? paymentMethod,
        CancellationToken cancellationToken)
    {
        var checkoutRequests = await _checkoutRequestRepository.GetAllAsync(
            status,
            paymentStatus,
            fulfillmentPreference,
            paymentMethod,
            cancellationToken);

        return checkoutRequests.Select(MapToDto).ToList();
    }

    public async Task<CheckoutRequestDto?> GetByIdAsync(
        string id,
        CancellationToken cancellationToken)
    {
        var checkoutRequest = await _checkoutRequestRepository.GetByIdAsync(id, cancellationToken);
        return checkoutRequest is null ? null : MapToDto(checkoutRequest);
    }

    public async Task<ServiceResult<CheckoutRequestDto>> CreateAsync(
        CreateCheckoutRequestDto request,
        CancellationToken cancellationToken)
    {
        var errors = ValidateRequestShape(request);
        if (errors.Count > 0)
        {
            return ServiceResult<CheckoutRequestDto>.ValidationFailure(errors);
        }

        var checkoutItems = new List<CheckoutRequestItem>();
        string? currency = null;
        var subtotalCents = 0;

        foreach (var item in request.Items)
        {
            var product = await _productRepository.GetByIdAsync(
                item.ProductId.Trim(),
                cancellationToken);

            if (product is null)
            {
                errors.Add($"Product '{item.ProductId}' was not found.");
                continue;
            }

            if (!product.InStock)
            {
                errors.Add($"Product '{product.Name}' is not in stock.");
                continue;
            }

            if (currency is null)
            {
                currency = product.Currency;
            }
            else if (!string.Equals(currency, product.Currency, StringComparison.OrdinalIgnoreCase))
            {
                errors.Add("Checkout items must use the same currency.");
                continue;
            }

            subtotalCents += product.PriceCents * item.Quantity;
            checkoutItems.Add(new CheckoutRequestItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPriceCents = product.PriceCents,
                ProductName = product.Name
            });
        }

        if (errors.Count > 0)
        {
            return ServiceResult<CheckoutRequestDto>.ValidationFailure(errors);
        }

        var checkoutRequest = new CheckoutRequest
        {
            Id = IdHelper.NewId("checkout"),
            CustomerName = request.CustomerName.Trim(),
            Phone = request.Phone.Trim(),
            Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim(),
            FulfillmentPreference = request.FulfillmentPreference.Trim().ToLowerInvariant(),
            PaymentMethod = request.PaymentMethod.Trim().ToLowerInvariant(),
            PaymentStatus = GetInitialPaymentStatus(request.PaymentMethod),
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            Items = checkoutItems,
            SubtotalCents = subtotalCents,
            Currency = currency ?? "USD",
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        await _checkoutRequestRepository.CreateAsync(checkoutRequest, cancellationToken);

        return ServiceResult<CheckoutRequestDto>.Success(MapToDto(checkoutRequest));
    }

    public async Task<ServiceResult<CheckoutRequestDto>> UpdateStatusAsync(
        string id,
        UpdateCheckoutRequestStatusDto request,
        CancellationToken cancellationToken)
    {
        if (!IsSupportedValue(request.Status, AllowedStatuses))
        {
            return ServiceResult<CheckoutRequestDto>.ValidationFailure([
                "Status must be pending, contacted, confirmed, fulfilled, or cancelled."
            ]);
        }

        var updated = await _checkoutRequestRepository.UpdateStatusAsync(
            id,
            request.Status.Trim().ToLowerInvariant(),
            DateTime.UtcNow,
            cancellationToken);

        return updated is null
            ? ServiceResult<CheckoutRequestDto>.NotFound(["Checkout request was not found."])
            : ServiceResult<CheckoutRequestDto>.Success(MapToDto(updated));
    }

    public async Task<ServiceResult<CheckoutRequestDto>> UpdatePaymentStatusAsync(
        string id,
        UpdateCheckoutPaymentStatusDto request,
        CancellationToken cancellationToken)
    {
        if (!IsSupportedValue(request.PaymentStatus, AllowedPaymentStatuses))
        {
            return ServiceResult<CheckoutRequestDto>.ValidationFailure([
                "Payment status must be not_paid, awaiting_manual_confirmation, paid, or rejected."
            ]);
        }

        var updated = await _checkoutRequestRepository.UpdatePaymentStatusAsync(
            id,
            request.PaymentStatus.Trim().ToLowerInvariant(),
            DateTime.UtcNow,
            cancellationToken);

        return updated is null
            ? ServiceResult<CheckoutRequestDto>.NotFound(["Checkout request was not found."])
            : ServiceResult<CheckoutRequestDto>.Success(MapToDto(updated));
    }

    private static List<string> ValidateRequestShape(CreateCheckoutRequestDto request)
    {
        var errors = new List<string>();

        if (!ValidationHelper.HasValue(request.CustomerName))
        {
            errors.Add("Customer name is required.");
        }

        if (!ValidationHelper.HasValue(request.Phone))
        {
            errors.Add("Phone is required.");
        }

        if (!ValidationHelper.HasValue(request.FulfillmentPreference))
        {
            errors.Add("Fulfillment preference is required.");
        }
        else
        {
            if (!IsSupportedValue(request.FulfillmentPreference, AllowedFulfillmentPreferences))
            {
                errors.Add("Fulfillment preference must be delivery or pickup.");
            }
        }

        if (!ValidationHelper.HasValue(request.PaymentMethod))
        {
            errors.Add("Payment method is required.");
        }
        else if (!IsSupportedValue(request.PaymentMethod, AllowedPaymentMethods))
        {
            errors.Add("Payment method must be pay_on_delivery or manual_lipa_payment.");
        }

        if (request.Items is null || request.Items.Count == 0)
        {
            errors.Add("At least one checkout item is required.");
            return errors;
        }

        foreach (var item in request.Items)
        {
            if (!ValidationHelper.HasValue(item.ProductId))
            {
                errors.Add("Product id is required for every checkout item.");
            }

            if (!ValidationHelper.IsPositive(item.Quantity))
            {
                errors.Add("Checkout item quantity must be greater than 0.");
            }
        }

        return errors;
    }

    private static string GetInitialPaymentStatus(string paymentMethod)
    {
        return string.Equals(
            paymentMethod.Trim(),
            "manual_lipa_payment",
            StringComparison.OrdinalIgnoreCase)
            ? "awaiting_manual_confirmation"
            : "not_paid";
    }

    private static bool IsSupportedValue(string? value, IReadOnlyCollection<string> allowedValues)
    {
        if (!ValidationHelper.HasValue(value))
        {
            return false;
        }

        return allowedValues.Contains(value!.Trim().ToLowerInvariant());
    }

    private static CheckoutRequestDto MapToDto(CheckoutRequest checkoutRequest)
    {
        return new CheckoutRequestDto(
            checkoutRequest.Id,
            checkoutRequest.CustomerName,
            checkoutRequest.Phone,
            checkoutRequest.Email,
            checkoutRequest.FulfillmentPreference,
            checkoutRequest.Notes,
            checkoutRequest.Items.Select(MapItemToDto).ToList(),
            checkoutRequest.SubtotalCents,
            checkoutRequest.Currency,
            checkoutRequest.Status,
            checkoutRequest.PaymentMethod,
            checkoutRequest.PaymentStatus,
            checkoutRequest.CreatedAt);
    }

    private static CheckoutRequestItemDto MapItemToDto(CheckoutRequestItem item)
    {
        return new CheckoutRequestItemDto(
            item.ProductId,
            item.Quantity,
            item.UnitPriceCents,
            item.ProductName);
    }
}
