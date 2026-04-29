using Luxora.Api.DTOs.CheckoutRequests;
using Luxora.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Luxora.Api.Controllers;

[ApiController]
[Route("api/checkout-requests")]
public sealed class CheckoutRequestsController : ControllerBase
{
    private readonly ICheckoutRequestService _checkoutRequestService;

    public CheckoutRequestsController(ICheckoutRequestService checkoutRequestService)
    {
        _checkoutRequestService = checkoutRequestService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(CheckoutRequestDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CheckoutRequestDto>> CreateCheckoutRequest(
        CreateCheckoutRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _checkoutRequestService.CreateAsync(request, cancellationToken);

        if (!result.IsSuccess)
        {
            return BadRequest(new { errors = result.Errors });
        }

        var checkoutRequest = result.Value!;
        return Created($"/api/checkout-requests/{checkoutRequest.Id}", checkoutRequest);
    }
}
