namespace TequioDemoTrack.Models.DTOs;
public class LocationDTO
{
    public int Id { get; set; }
    public string LocationValue { get; set; } = string.Empty;
    public ICollection<CustomerDTO> Customers { get; set; } = new List<CustomerDTO>();
}
