using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TequioDemoTrack.Data;

[ApiController]
[Route("api/[controller]")]


public class RaceController : ControllerBase
{
    private TequioDemoTrackDbContext _dbContext;

    public RaceController(TequioDemoTrackDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext
        .Races
        .ToList());
    }
}