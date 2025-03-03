using Microsoft.AspNetCore.Identity;

namespace TequioDemoTrack.Models;

public class UserProfile
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Address { get; set; }
    public bool IsActive { get; set; }
    public DateTime StartDate { get; set; }

    public string IdentityUserId { get; set; }

    public IdentityUser IdentityUser { get; set; }
    public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
}