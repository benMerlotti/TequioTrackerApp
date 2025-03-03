using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TequioDemoTrack.Data;
using TequioDemoTrack.Models;
using TequioDemoTrack.Models.DTOs;

[ApiController]
[Route("api/[controller]")]

public class AmbassadorController : ControllerBase
{
    private TequioDemoTrackDbContext _dbContext;

    public AmbassadorController(TequioDemoTrackDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext
        .UserProfiles
        .Include(up => up.IdentityUser)
        .ToList());
    }

    [HttpGet("withroles")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetWithRoles()
    {
        return Ok(_dbContext.UserProfiles
        .Include(up => up.IdentityUser)
        .Select(up => new UserProfileDTO
        {
            Id = up.Id,
            FirstName = up.FirstName,
            LastName = up.LastName,
            Email = up.IdentityUser.Email,
            Address = up.Address,
            IsActive = up.IsActive,
            UserName = up.IdentityUser.UserName,
            IdentityUserId = up.IdentityUserId,
            Roles = _dbContext.UserRoles
            .Where(ur => ur.UserId == up.IdentityUserId)
            .Select(ur => _dbContext.Roles.SingleOrDefault(r => r.Id == ur.RoleId).Name)
            .ToList()
        }));
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetAmbassadorById(int id)
    {
        return Ok(_dbContext.UserProfiles
      .Include(up => up.IdentityUser)
      .Select(up => new UserProfileDTO
      {
          Id = up.Id,
          FirstName = up.FirstName,
          LastName = up.LastName,
          Email = up.IdentityUser.Email,
          Address = up.Address,
          IsActive = up.IsActive,
          UserName = up.IdentityUser.UserName,
          IdentityUserId = up.IdentityUserId,
          Roles = _dbContext.UserRoles
          .Where(ur => ur.UserId == up.IdentityUserId)
          .Select(ur => _dbContext.Roles.SingleOrDefault(r => r.Id == ur.RoleId).Name).ToList()
      }).FirstOrDefault(up => up.Id == id));
    }

    [HttpPut("{id}/updateStatus")]
    [Authorize]
    public IActionResult ToggleActivationAmbassador(int id)
    {
        UserProfile foundUser = _dbContext.UserProfiles.FirstOrDefault(up => up.Id == id);


        if (foundUser.IsActive)
        {
            foundUser.IsActive = false;
        }
        else
        {
            foundUser.IsActive = true;
        }
        _dbContext.SaveChanges();
        return Ok(foundUser);
    }

    [HttpPut("{id}/edit")]
    [Authorize]
    public IActionResult EditAmbassador(IMapper mapper, int id, EditUserProfileDTO userProfileDto)
    {
        var foundAmbassador = _dbContext.UserProfiles
            .Include(up => up.IdentityUser)
            .FirstOrDefault(up => up.Id == id);

        if (foundAmbassador == null)
        {
            return NotFound("Ambassador not found.");
        }

        // Use AutoMapper to map the DTO to the model
        mapper.Map(userProfileDto, foundAmbassador);

        // Manually update IdentityUser.Email if necessary
        if (foundAmbassador.IdentityUser != null)
        {
            foundAmbassador.IdentityUser.Email = userProfileDto.Email;
        }

        // Save changes to the database
        _dbContext.SaveChanges();

        return NoContent();
    }



    [HttpDelete("{id}/delete")]
    [Authorize]
    public IActionResult DeleteAmbassador(int id)
    {
        var foundAmbassador = _dbContext.UserProfiles.FirstOrDefault(up => up.Id == id);
        _dbContext.UserProfiles.Remove(foundAmbassador);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpGet("pending-activations")]
    // [Authorize]
    public IActionResult GetPendingActivations()
    {
        try
        {
            // Get the date 30 days ago
            var cutoffDate = DateTime.UtcNow.AddDays(-30);

            // Fetch details of inactive users registered within the past 30 days
            var pendingUsers = _dbContext.UserProfiles
                .Where(up => !up.IsActive && up.StartDate >= cutoffDate)
                .Select(up => new
                {
                    up.Id,
                    up.FirstName,
                    up.LastName,
                    up.Address,
                    up.StartDate,
                    up.IdentityUserId,
                    Email = _dbContext.Users
                        .Where(u => u.Id == up.IdentityUserId)
                        .Select(u => u.Email)
                        .FirstOrDefault() // Include email from ASPNETUsers
                })
                .ToList();

            return Ok(pendingUsers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while fetching pending activations.");
        }
    }


}