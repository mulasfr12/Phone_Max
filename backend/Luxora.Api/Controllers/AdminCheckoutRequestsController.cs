using Luxora.Api.DTOs.CheckoutRequests;
using Luxora.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/checkout-requests")]
public sealed class AdminCheckoutRequestsController : ControllerBase
{
    private readonly ICheckoutRequestService _checkoutRequestService;

    public AdminCheckoutRequestsController(ICheckoutRequestService checkoutRequestService)
    {
        _checkoutRequestService = checkoutRequestService;
    }

    // TODO: Protect admin endpoints with authentication and authorization before production.
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<CheckoutRequestDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<CheckoutRequestDto>>> GetCheckoutRequests(
        [FromQuery] string? status,
        [FromQuery] string? paymentStatus,
        [FromQuery] string? fulfillmentPreference,
        [FromQuery] string? paymentMethod,
        CancellationToken cancellationToken)
    {
        var checkoutRequests = await _checkoutRequestService.GetAllAsync(
            status,
            paymentStatus,
            fulfillmentPreference,
            paymentMethod,
            cancellationToken);

        return Ok(checkoutRequests);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CheckoutRequestDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CheckoutRequestDto>> GetCheckoutRequestById(
        string id,
        CancellationToken cancellationToken)
    {
        var checkoutRequest = await _checkoutRequestService.GetByIdAsync(id, cancellationToken);

        if (checkoutRequest is null)
        {
            return NotFound();
        }

        return Ok(checkoutRequest);
    }

    [HttpPatch("{id}/status")]
    [ProducesResponseType(typeof(CheckoutRequestDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CheckoutRequestDto>> UpdateStatus(
        string id,
        UpdateCheckoutRequestStatusDto request,
        CancellationToken cancellationToken)
    {
        var result = await _checkoutRequestService.UpdateStatusAsync(
            id,
            request,
            cancellationToken);

        return ToActionResult(result);
    }

    [HttpPatch("{id}/payment-status")]
    [ProducesResponseType(typeof(CheckoutRequestDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CheckoutRequestDto>> UpdatePaymentStatus(
        string id,
        UpdateCheckoutPaymentStatusDto request,
        CancellationToken cancellationToken)
    {
        var result = await _checkoutRequestService.UpdatePaymentStatusAsync(
            id,
            request,
            cancellationToken);

        return ToActionResult(result);
    }

    private ActionResult<CheckoutRequestDto> ToActionResult(
        Services.ServiceResult<CheckoutRequestDto> result)
    {
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        if (result.IsNotFound)
        {
            return NotFound(new { errors = result.Errors });
        }

        return BadRequest(new { errors = result.Errors });
    }
}
