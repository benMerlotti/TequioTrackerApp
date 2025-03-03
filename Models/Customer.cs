using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TequioDemoTrack.Models;
public class Customer
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    [Required]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string Address { get; set; } = string.Empty;
    public int AgeGroupId { get; set; }
    public AgeGroup AgeGroup { get; set; }
    public int GenderId { get; set; }
    public Gender Gender { get; set; } = null!;
    public int RaceId { get; set; }
    public Race Race { get; set; } = null!;
    public int LocationId { get; set; }
    public Location Location { get; set; } = null!;
    public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
}

