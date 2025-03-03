namespace TequioDemoTrack.Models.DTOs;
public class RaceDTO
{
    public int Id { get; set; }
    public string RaceValue { get; set; } = string.Empty;
    public ICollection<CustomerDTO> Customers { get; set; } = new List<CustomerDTO>();
}
