namespace TequioDemoTrack.Models.DTOs;
public class CustomerDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int AgeGroupId { get; set; }
    public AgeGroupDTO AgeGroup { get; set; } = null!;
    public int GenderId { get; set; }
    public GenderDTO Gender { get; set; } = null!;
    public int RaceId { get; set; }
    public RaceDTO Race { get; set; } = null!;
    public int LocationId { get; set; }
    public LocationDTO Location { get; set; } = null!;

    public ICollection<PurchaseDTO> Purchases { get; set; } = new List<PurchaseDTO>();
}
public class CreateCustomerDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int AgeGroupId { get; set; }
    public int GenderId { get; set; }
    public int RaceId { get; set; }
    public int LocationId { get; set; }
}
