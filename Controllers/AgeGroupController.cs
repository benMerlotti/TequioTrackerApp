using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TequioDemoTrack.Data;

[ApiController]
[Route("api/[controller]")]

public class AgeGroupController : ControllerBase
{
    private TequioDemoTrackDbContext _dbContext;

    public AgeGroupController(TequioDemoTrackDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    // [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext
        .AgeGroups
        .Include(a => a.Customers)
        .ToList());
    }
}