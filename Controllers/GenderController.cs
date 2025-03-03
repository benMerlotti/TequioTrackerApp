using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TequioDemoTrack.Data;

[ApiController]
[Route("api/[controller]")]

public class GenderController : ControllerBase
{
    private TequioDemoTrackDbContext _dbContext;

    public GenderController(TequioDemoTrackDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext
        .Genders
        .Include(g => g.Customers)
        .ToList());
    }
}