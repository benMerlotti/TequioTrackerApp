using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TequioDemoTrack.Data;

[ApiController]
[Route("api/[controller]")]

public class LocationController : ControllerBase
{
    private TequioDemoTrackDbContext _dbContext;

    public LocationController(TequioDemoTrackDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext
        .Locations
        .ToList());
    }

    [HttpGet("top-locations")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetTopLocations()
    {
        var topLocations = _dbContext.Customers
            .Include(c => c.Location)
            .GroupBy(c => c.Location)
            .Select(group => new
            {
                Location = group.Key,
                Count = group.Count()
            })
            .OrderByDescending(l => l.Count)
            .Take(5) // Get the top 5
            .ToList();

        return Ok(topLocations);
    }

}