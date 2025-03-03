using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using TequioDemoTrack.Models;
using TequioDemoTrack.Models.DTOs;
using TequioDemoTrack.Data;

namespace TequioDemoTrack.Controllers;


[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private TequioDemoTrackDbContext _dbContext;
    private UserManager<IdentityUser> _userManager;

    public AuthController(TequioDemoTrackDbContext context, UserManager<IdentityUser> userManager)
    {
        _dbContext = context;
        _userManager = userManager;
    }

    [HttpPost("login")]
    public IActionResult Login([FromHeader(Name = "Authorization")] string authHeader)
    {
        try
        {
            string encodedCreds = authHeader.Substring(6).Trim();
            string creds = Encoding
                .GetEncoding("iso-8859-1")
                .GetString(Convert.FromBase64String(encodedCreds));

            // Get email and password
            int separator = creds.IndexOf(':');
            string email = creds.Substring(0, separator);
            string password = creds.Substring(separator + 1);

            // Fetch the ASPNETUsers record
            var user = _dbContext.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                return new UnauthorizedResult();
            }

            // Fetch the corresponding UserProfile using identityUserId
            var userProfile = _dbContext.UserProfiles
                .FirstOrDefault(up => up.IdentityUserId == user.Id);
            if (userProfile == null)
            {
                return new UnauthorizedResult();
            }

            // Check if the user is active
            if (!userProfile.IsActive)
            {
                return StatusCode(403, "Your account is inactive. Please contact the administrator.");
            }

            // Verify password
            var hasher = new PasswordHasher<IdentityUser>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Success)
            {
                var userRoles = _dbContext.UserRoles.Where(ur => ur.UserId == user.Id).ToList();

                var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

                foreach (var userRole in userRoles)
                {
                    var role = _dbContext.Roles.FirstOrDefault(r => r.Id == userRole.RoleId);
                    claims.Add(new Claim(ClaimTypes.Role, role.Name));
                }

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity)).Wait();

                return Ok();
            }

            return new UnauthorizedResult();
        }
        catch (Exception ex)
        {
            return StatusCode(500);
        }
    }

    [HttpGet("Me")]
    [Authorize]
    public IActionResult Me()
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);

        if (profile == null)
        {
            return NotFound("User profile not found.");
        }

        var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

        var userDto = new UserProfileDTO
        {
            Id = profile.Id,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            Address = profile.Address,
            IdentityUserId = identityUserId,
            UserName = User.FindFirstValue(ClaimTypes.Name),
            Email = User.FindFirstValue(ClaimTypes.Email),
            Roles = roles
        };

        return Ok(userDto);
    }

    [HttpGet]
    [Route("logout")]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public IActionResult Logout()
    {
        try
        {
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme).Wait();
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500);
        }
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register(RegistrationDTO registration)
    {
        try
        {
            // Create IdentityUser
            var user = new IdentityUser
            {
                UserName = registration.UserName,
                Email = registration.Email
            };

            // Decode Base64 password
            var password = Encoding
                .GetEncoding("iso-8859-1")
                .GetString(Convert.FromBase64String(registration.Password));

            // Attempt to create user
            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                // Add UserProfile with isActive set to false
                _dbContext.UserProfiles.Add(new UserProfile
                {
                    FirstName = registration.FirstName,
                    LastName = registration.LastName,
                    Address = registration.Address,
                    IdentityUserId = user.Id,
                    IsActive = false, // Newly registered users are inactive
                    StartDate = DateTime.UtcNow // Registration timestamp
                });

                await _dbContext.SaveChangesAsync();

                // Return success message
                return Ok("Registration successful. Please wait for activation.");
            }

            // Collect and return errors if registration failed
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return BadRequest($"Registration failed. Errors: {errors}");
        }
        catch (Exception ex)
        {
            // Log the exception and return server error
            Console.WriteLine($"Error during registration: {ex.Message}");
            return StatusCode(500, "An error occurred during registration.");
        }
    }






}