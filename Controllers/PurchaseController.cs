using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TequioDemoTrack.Data;
using TequioDemoTrack.Models;
using TequioDemoTrack.Models.DTOs;

[ApiController]
[Route("api/[controller]")]

public class PurchaseController : ControllerBase
{
    private TequioDemoTrackDbContext _dbContext;

    public PurchaseController(TequioDemoTrackDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetPurchases()
    {
        var purchases = _dbContext.Purchases
            .Include(p => p.Customer)
            .Include(p => p.UserProfile)
            .Include(p => p.PurchaseProducts)
            .ThenInclude(pp => pp.Product)
            .ToList();

        return Ok(purchases);
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetPurchasesById(int id)
    {
        var purchase = _dbContext.Purchases
            .Include(p => p.Customer)
            .Include(p => p.UserProfile)
            .ThenInclude(up => up.IdentityUser)
            .Include(p => p.PurchaseProducts)
            .ThenInclude(pp => pp.Product).FirstOrDefault(p => p.Id == id);

        return Ok(purchase);
    }


    [HttpPost]
    [Authorize]
    public IActionResult CreatePurchase([FromBody] CreatePurchaseDTO model)
    {
        // Validate input
        if (model == null || model.PurchaseProducts == null || model.PurchaseProducts.Count == 0)
        {
            return BadRequest("Invalid data.");
        }

        // Check if Customer exists
        var customerExists = _dbContext.Customers.Any(c => c.Id == model.CustomerId);
        if (!customerExists)
        {
            return NotFound($"Customer with ID {model.CustomerId} not found.");
        }

        // Check if Employee exists
        var ambassadorExists = _dbContext.UserProfiles.Any(up => up.Id == model.UserProfileId);
        if (!ambassadorExists)
        {
            return NotFound($"Employee with ID {model.UserProfileId} not found.");
        }

        // Create a new Purchase object
        var purchase = new Purchase
        {
            CustomerId = model.CustomerId,
            UserProfileId = model.UserProfileId,
            PurchaseDate = DateTime.UtcNow
        };

        // Add PurchaseProducts to the Purchase
        foreach (var purchaseProductDto in model.PurchaseProducts)
        {
            var product = _dbContext.Products.Find(purchaseProductDto.ProductId);
            if (product == null)
            {
                return NotFound($"Product with ID {purchaseProductDto.ProductId} not found.");
            }

            var purchaseProduct = new PurchaseProduct
            {
                ProductId = purchaseProductDto.ProductId,
                Quantity = purchaseProductDto.Quantity
            };

            purchase.PurchaseProducts.Add(purchaseProduct);
        }

        // Save the Purchase and PurchaseProducts
        _dbContext.Purchases.Add(purchase);
        _dbContext.SaveChanges();

        // Return a response indicating the success of the operation
        return Created($"/api/Purchase/{purchase.Id}", purchase);
    }

    [HttpPut("{id}/edit")]
    [Authorize]
    public IActionResult EditPurchase(IMapper _mapper, int id, [FromBody] List<UpdatePurchaseProductDTO> purchaseProducts)
    {
        Purchase foundPurchase = _dbContext.Purchases
       .Include(p => p.PurchaseProducts)
       .FirstOrDefault(p => p.Id == id);

        if (foundPurchase == null)
        {
            return NotFound($"Purchase with ID {id} not found.");
        }

        // Remove existing products
        _dbContext.PurchaseProducts.RemoveRange(foundPurchase.PurchaseProducts);

        // Map DTOs to PurchaseProduct entities and set PurchaseId
        var newProducts = _mapper.Map<List<PurchaseProduct>>(purchaseProducts);
        newProducts.ForEach(product => product.PurchaseId = id);

        // Add new products to the purchase
        foundPurchase.PurchaseProducts = newProducts;

        // Save changes to the database
        _dbContext.SaveChanges();

        return Ok("Purchase updated successfully.");
    }

    [HttpDelete("{id}/delete")]
    [Authorize]
    public IActionResult DeletePurchase(int id)
    {
        var foundPurchase = _dbContext.Purchases
            .Include(p => p.PurchaseProducts) // Make sure to include the related PurchaseProducts
            .FirstOrDefault(p => p.Id == id);

        if (foundPurchase == null)
        {
            return NotFound($"Purchase with ID {id} not found.");
        }

        // Remove all related PurchaseProducts
        _dbContext.PurchaseProducts.RemoveRange(foundPurchase.PurchaseProducts);

        // Remove the Purchase
        _dbContext.Purchases.Remove(foundPurchase);

        // Save changes to the database
        _dbContext.SaveChanges();

        return NoContent(); // No content returned, as the resource is deleted
    }

}

