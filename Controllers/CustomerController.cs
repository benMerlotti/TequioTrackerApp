using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TequioDemoTrack.Data;
using TequioDemoTrack.Models;
using TequioDemoTrack.Models.DTOs;

[ApiController]
[Route("api/[controller]")]

public class CustomerController : ControllerBase
{
    private TequioDemoTrackDbContext _dbContext;

    public CustomerController(TequioDemoTrackDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext
        .Customers
        .Include(c => c.Purchases)
        .ToList());
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetCustomerById(int id)
    {
        Customer foundCustomer = _dbContext
        .Customers
        .Include(c => c.AgeGroup)
        .Include(c => c.Location)
        .Include(c => c.Race)
        .Include(c => c.Gender)
        .Include(c => c.Purchases)
        .ThenInclude(p => p.PurchaseProducts)
        .ThenInclude(pp => pp.Product)
        .FirstOrDefault(c => c.Id == id);
        return Ok(foundCustomer);
    }


    [HttpPost]
    [Authorize]
    public IActionResult CreateCustomer(IMapper mapper, CreateCustomerDTO customer)
    {
        var newCustomer = mapper.Map<Customer>(customer);
        _dbContext.Customers.Add(newCustomer);
        _dbContext.SaveChanges();

        return Created($"/api/Customer/{newCustomer.Id}", newCustomer);
    }

    [HttpDelete("{id}/delete")]
    [Authorize]
    public IActionResult DeleteCustomer(int id)
    {
        var foundCustomer = _dbContext.Customers.FirstOrDefault(c => c.Id == id);
        _dbContext.Customers.Remove(foundCustomer);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpPut("{id}/edit")]
    [Authorize]
    public IActionResult EditCustomer(int id, CreateCustomerDTO customer)
    {
        var foundCustomer = _dbContext.Customers.FirstOrDefault(c => c.Id == id);

        foundCustomer.Name = customer.Name;
        foundCustomer.Email = customer.Email;
        foundCustomer.Address = customer.Address;
        foundCustomer.AgeGroupId = customer.AgeGroupId;
        foundCustomer.GenderId = customer.GenderId;
        foundCustomer.RaceId = customer.RaceId;
        foundCustomer.LocationId = customer.LocationId;

        _dbContext.SaveChanges();

        return NoContent();
    }
}